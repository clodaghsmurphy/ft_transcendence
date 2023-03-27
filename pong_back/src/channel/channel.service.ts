import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Channel, Message } from '@prisma/client';
import { PrismaService } from "src/prisma/prisma.service";
import { ChannelCreateDto, ChannelJoinDto, ChannelLeaveDto, MessageCreateDto } from "./dto";
import * as bcrypt from 'bcrypt';
import { UserService } from "src/user/user.service";

@Injectable()
export class ChannelService {
	constructor (private prisma: PrismaService, private userService: UserService) {}

	async getAll(): Promise<unknown[]> {
		const channels: Channel[] = await this.prisma.channel.findMany();

		return channels.map((channel) => this.returnInfo(channel));
	}

	async get(channelName: string) : Promise<unknown> {
		await this.checkChannel(channelName);

		const channel: Channel = await this.prisma.channel.findUnique({
			where: { name: channelName },
		});

		return this.returnInfo(channel);
	}

	async getInfo(channelName: string, attribute: string) {
		await this.checkChannel(channelName);

		const channel: Channel = await this.prisma.channel.findUnique({
			where: {name: channelName},
		});
		return {attribute: channel[attribute]};
	}

	async create(dto: ChannelCreateDto) : Promise<unknown> {
		await this.checkUser(dto.owner_id);
		for (const user of dto.users_ids) {
			await this.checkUser(user);
		}

		dto.users_ids.push(dto.owner_id);

		try {
			let data = {
				name: dto.name,
				operators: [dto.owner_id],
				owner: dto.owner_id,
				members: dto.users_ids,
			}

			if (dto.hasOwnProperty('password')) {
				const salt = await bcrypt.genSalt();
				const hash = await bcrypt.hash(dto.password, salt);
				data['password'] = hash;
			}

			const channel: Channel = await this.prisma.channel.create({data: data});
			dto.users_ids.forEach(async(user) => await this.userService.joinChannel(user, dto.name));
			return this.returnInfo(channel);
		} catch (e) {
			if (e.code == 'P2002') {
				throw new HttpException({
					status: HttpStatus.BAD_REQUEST,
					error: `Channel ${dto.name} already exists`,
				}, HttpStatus.BAD_REQUEST);
			}
			throw e;
		}
	}

	async join(dto: ChannelJoinDto) : Promise<unknown> {
		await this.checkUser(dto.user_id);
		await this.checkChannel(dto.name);

		if (!await this.checkPassword(dto))
		{
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `Invalid password for channel ${dto.name}`,
			}, HttpStatus.BAD_REQUEST);
		}

		// Check that user isn't already joined
		if (await this.prisma.channel.count({where: {
				name: dto.name,
				members: {has: dto.user_id}
			}}) > 0)
		{
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `User ${dto.user_id} has already joined channel ${dto.name}`,
			}, HttpStatus.BAD_REQUEST);
		}

		const channel: Channel = await this.prisma.channel.update({
			where: {name: dto.name},
			data: {
				members: {push: dto.user_id}
			},
		});
		this.userService.joinChannel(dto.user_id, dto.name);

		return this.returnInfo(channel);
	}

	async leave(dto: ChannelLeaveDto) : Promise<unknown> {
		await this.checkUserInChannel(dto.user_id, dto.name);

		const channel: Channel = await this.prisma.channel.findUnique({where: {name: dto.name}});

		const updateChannel: Channel = await this.prisma.channel.update({
			where: {name: dto.name},
			data: {
				members: {set: channel.members.filter((id) => id !== dto.user_id)},
				operators: {set: channel.members.filter((id) => id !== dto.user_id)},
			},
		});

		return this.returnInfo(updateChannel);
	}

	async getAllMessages(channelName: string) : Promise<Message[]> {
		await this.checkChannel(channelName);

		const channel: Channel = await this.prisma.channel.findUnique({where: {name: channelName}});
		const messageIds: number[] = channel.messages;

		return await this.prisma.message.findMany({
			where: {
				id: {in: messageIds},
			},
		});
	}

	async postMessage(dto: MessageCreateDto) : Promise<Message> {
		await this.checkUserInChannel(dto.sender_id, dto.name);

		const message = await this.prisma.message.create({
			data: {
				uid: dto.uid,
				text: dto.text,
				sender_name: dto.sender_name,
				sender_id: dto.sender_id,
				channel: dto.name,
				type: 0,
			},
		});
		await this.prisma.channel.update({
			where: {name: dto.name},
			data: {
				messages: {push: message.id},
			},
		});
		return message;
	}

	async checkUser(id: number) {
		if (await this.prisma.user.count({where: {id: id}}) == 0)
		{
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `User ${id} doesn't exist`,
			}, HttpStatus.BAD_REQUEST);
		}
	}

	async checkChannel(channelName: string) {
		if (await this.prisma.channel.count({where: {name: channelName}}) == 0)
		{
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `Channel ${channelName} doesn't exist`,
			}, HttpStatus.BAD_REQUEST);
		}
	}

	async checkUserInChannel(userId: number, channelName: string) {
		await this.checkUser(userId);
		await this.checkChannel(channelName);

		if (await this.prisma.channel.count({where: {
			name: channelName,
			members: {has: userId}
		}}) == 0)
		{
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `User ${userId} has not joined channel ${channelName}`,
			}, HttpStatus.BAD_REQUEST);
		}
	}

	async checkOperator(userId: number, channelName: string) {
		await this.checkUser(userId);

		if (await this.prisma.channel.count({where: {
			name: channelName,
			operators: {has: userId}
		}}) == 0)
		{
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `User ${userId} isn't an operator of channel ${channelName},`
			}, HttpStatus.BAD_REQUEST);
		}
	}

	async checkPassword(dto: ChannelJoinDto) {
		const channel = await this.prisma.channel.findUnique({where: {name: dto.name}});

		if (channel.password === null)
			return true;

		if (!dto.hasOwnProperty('password'))
			return false;

		return await bcrypt.compare(dto.password, channel.password);
	}

	returnInfo(channel: Channel) {
		let data: any = channel;

		data.password = (channel.password === null ? false : true);
		return data;
	}
}

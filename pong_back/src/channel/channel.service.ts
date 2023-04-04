import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Channel, Message, MuteInfo } from '@prisma/client';
import { PrismaService } from "src/prisma/prisma.service";
import { ChannelCreateDto, ChannelJoinDto, ChannelLeaveDto, ChannelPasswordDto, MakeOpDto, MessageCreateDto, UserBanDto, UserMuteDto } from "./dto";
import * as bcrypt from 'bcrypt';
import { UserService } from "src/user/user.service";
import { info } from "console";
import { MessageType } from "./types/message.type";

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

	async create(dto: any) : Promise<unknown> {
		await this.checkUser(dto.owner_id);

		let data = {
			name: dto.name,
			operators: [dto.owner_id],
			owner: dto.owner_id,
			is_public: true,
		}

		if (dto.hasOwnProperty('users_ids'))
		{
			for (const user of dto.users_ids) {
				await this.checkUser(user);
			}
			dto.users_ids.push(dto.owner_id);
			data['members'] = dto.users_ids;
		}
		else
			data['members'] = [dto.owner_id];

		try {
			if (dto.hasOwnProperty('is_public') && dto.is_public === false)
				data.is_public = false;

			if (dto.hasOwnProperty('password')) {
				const salt = await bcrypt.genSalt();
				const hash = await bcrypt.hash(dto.password, salt);
				data['password'] = hash;
			}

			const channel: Channel = await this.prisma.channel.create({data: data});

			if (dto.hasOwnProperty('users_ids'))
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

	async changePassword(dto: any) {
		let hash: string = null;
		if (dto.hasOwnProperty('password')) {
			const salt = await bcrypt.genSalt();
			hash = await bcrypt.hash(dto.password, salt);
		}

		const updatedChannel: Channel = await this.prisma.channel.update({
			where: {name: dto.name},
			data: {password: hash}
		});

		return updatedChannel;
	}

	async join(dto: any) : Promise<unknown> {
		await this.checkCanJoin(dto);

		const channel: Channel = await this.prisma.channel.update({
			where: {name: dto.name},
			data: {
				members: {push: dto.user_id}
			},
		});
		this.userService.joinChannel(dto.user_id, dto.name);

		return this.returnInfo(channel);
	}

	async leave(dto: any) : Promise<unknown> {
		await this.checkUserInChannel(dto.user_id, dto.name);

		const channel: Channel = await this.prisma.channel.findUnique({where: {name: dto.name}});

		const updateChannel: Channel = await this.prisma.channel.update({
			where: {name: dto.name},
			data: {
				members: {set: channel.members.filter((id) => id !== dto.user_id)},
				operators: {set: channel.operators.filter((id) => id !== dto.user_id)},
			},
		});
		this.userService.leaveChannel(dto.user_id, dto.name);

		return this.returnInfo(updateChannel);
	}

	async mute(dto: any) {
		await this.checkIsNotOwner(dto.target_id, dto.name);

		const muteTime = new Date();
		muteTime.setSeconds(muteTime.getSeconds() + dto.mute_duration);

		const muteInfo: MuteInfo = await this.prisma.muteInfo.create({
			data: {
				userId: dto.target_id,
				muteTime: muteTime,
				channel: {
					connect: {name: dto.name},
				}
			},
		});

		await this.prisma.channel.update({
			where: {name: dto.name},
			data: {
				mutedUsers: {
					connect: {id: muteInfo.id},
				}
			}
		});

		return dto;
	}

	async ban(dto: any) {
		await this.checkIsNotOwner(dto.target_id, dto.name);

		await this.prisma.channel.update({
			where: {name: dto.name},
			data: {
				banned: {push: dto.target_id}
			}
		});
		this.leave({name: dto.name, user_id: dto.target_id});
	}

	async makeOp(dto: any) {
		await this.checkUserInChannel(dto.target_id, dto.name);

		if (await this.prisma.channel.count({where: {
			name: dto.name,
			operators: {has: dto.target_id}
		}}) !== 0) {
			throw new HttpException({
				error: `User ${dto.target_id} is already an operator`,
				status: HttpStatus.BAD_REQUEST,
			}, HttpStatus.BAD_REQUEST);
		}

		await this.prisma.channel.update({
			where: {name: dto.name},
			data: {
				operators: {push: dto.target_id}
			}
		});
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

	async postMessage(messageData) {
		if (messageData.type === MessageType.Normal)
			await this.checkIsMuted(messageData);

		const message = await this.prisma.message.create({data: messageData});
		await this.prisma.channel.update({
			where: {name: messageData.name},
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
				error: `User ${userId} isn't an operator of channel ${channelName}`
			}, HttpStatus.BAD_REQUEST);
		}
	}

	async checkIsOwner(userId: number, channelName: string) {
		await this.checkUserInChannel(userId, channelName);

		const channel: Channel = await this.prisma.channel.findUnique({where: {name: channelName}});

		if (channel.owner !== userId) {
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `User ${userId} is not the owner of channel ${channelName}`
			}, HttpStatus.BAD_REQUEST);
		}
	}

	async checkIsNotOwner(userId: number, channelName: string) {
		await this.checkUserInChannel(userId, channelName);

		const channel: Channel = await this.prisma.channel.findUnique({where: {name: channelName}});

		if (channel.owner === userId) {
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `User ${userId} is the owner of channel ${channelName}`
			}, HttpStatus.BAD_REQUEST);
		}
	}

	async checkCanJoin(dto: any) {
		await this.checkUser(dto.user_id);
		await this.checkChannel(dto.name);

		const channel = await this.prisma.channel.findUnique({where: {name: dto.name}});

		if (channel.is_public === false) {
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `Channel ${dto.name} is private`,
			}, HttpStatus.BAD_REQUEST);
		}

		// Check that user isn't banned from channel
		if (channel.banned.find((id) => id === dto.user_id)) {
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `User ${dto.user_id} is banned from channel ${dto.name}`,
			}, HttpStatus.BAD_REQUEST);
		}

		// Check that password is correct
		if (channel.password !== null && (!dto.hasOwnProperty('password') || !(await bcrypt.compare(dto.password, channel.password)))) {
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
	}

	async checkIsMuted(dto: any) {
		await this.checkUserInChannel(dto.sender_id, dto.name);

		const mutedUser = await this.prisma.muteInfo.findFirst({
			where: {
				userId: dto.sender_id,
				channelName: dto.name,
			},
			orderBy: {
				muteTime: 'desc',
			}
		})

		if (!mutedUser)
			return ;

		const now = new Date();
		if (now > mutedUser.muteTime) {
			await this.prisma.muteInfo.delete({where: {id: mutedUser.id}});
			return ;
		}
		throw new HttpException({
			status: HttpStatus.BAD_REQUEST,
			error: `User ${dto.sender_id} is still muted from channel ${dto.name} until ${mutedUser.muteTime}`
		}, HttpStatus.BAD_REQUEST);
	}

	async getUserInfo(userId: number, attribute: string) {
		return this.userService.getInfo(userId, attribute);
	}

	returnInfo(channel: Channel) {
		let data: any = channel;

		data.password = (channel.password === null ? false : true);
		return data;
	}
}

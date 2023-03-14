import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Channel, Message } from '@prisma/client';
import { PrismaService } from "src/prisma/prisma.service";
import { ChannelCreateDto, MessageCreateDto } from "./dto";

@Injectable()
export class ChannelService {
	constructor (private prisma: PrismaService) {}

	async getAll(): Promise<Channel[]> {
		return await this.prisma.channel.findMany();
	}

	async get(channelName: string) : Promise<Channel> {
		return await this.prisma.channel.findUnique({
			where: { name: channelName },
		});
	}

	async getInfo(channelName: string, attribute: string) {
		await this.checkChannel(channelName);

		const channel: Channel = await this.prisma.channel.findUnique({
			where: {name: channelName},
		});
		return {attribute: channel[attribute]};
	}

	async create(dto: ChannelCreateDto) : Promise<Channel> {
		await this.checkUser(dto.user_id);

		try {
			return await this.prisma.channel.create({
				data: {
					name: dto.name,
					operators: [dto.user_id],
					members: [dto.user_id],
				},
			});
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

	async join(dto: ChannelCreateDto) : Promise<Channel> {
		await this.checkUser(dto.user_id);
		await this.checkChannel(dto.name);

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

		return await this.prisma.channel.update({
			where: {name: dto.name},
			data: {
				members: {push: dto.user_id}
			},
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

	async postMessage(channelName: string, dto: MessageCreateDto) : Promise<Message> {
		await this.checkChannel(channelName);

		const message = await this.prisma.message.create({
			data: {
				uid: dto.uid,
				text: dto.text,
				sender_name: dto.sender_name,
				sender_id: dto.sender_id,
				channel: channelName,
				type: 0,
			},
		});
		await this.prisma.channel.update({
			where: {name: channelName},
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
}

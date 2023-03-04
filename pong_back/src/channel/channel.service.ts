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

	async create(dto: ChannelCreateDto) : Promise<Channel> {
		await this.checkUser(dto.username);
		try {
			return await this.prisma.channel.create({
				data: {
					name: dto.name,
					operators: [dto.username],
					members: [dto.username],
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
		await this.checkUser(dto.username);
		if (await this.prisma.channel.count({where: {
				name: dto.name,
				members: {has: dto.username}
			}}) > 0)
		{
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `User ${dto.username} has already joined channel ${dto.name}`,
			}, HttpStatus.BAD_REQUEST);
		}

		try {
			return await this.prisma.channel.update({
				where: {name: dto.name},
				data: {
					members: {push: dto.username}
				},
			});
		} catch (e) {
			if (e.code == 'P2025') {
				throw new HttpException({
					status: HttpStatus.BAD_REQUEST,
					error: `Channel ${dto.name} doesn't exist`,
				}, HttpStatus.BAD_REQUEST);
			}
			throw e;
		}
	}

	async getAllMessages(channelName: string) : Promise<Message[]> {
		this.checkChannel(channelName);

		const channel: Channel = await this.prisma.channel.findUnique({where: {name: channelName}});
		const messageIds: number[] = channel.messages;

		return await this.prisma.message.findMany({
			where: {
				id: {in: messageIds},
			},
		});
	}

	async postMessage(channelName: string, dto: MessageCreateDto) : Promise<Message> {
		this.checkChannel(channelName);

		const message = await this.prisma.message.create({
			data: {
				uid: dto.uid,
				text: dto.text,
				name: dto.name,
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

	async checkUser(username: string) {
		if (await this.prisma.user.count({where: {name: username}}) == 0)
		{
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `User ${username} doesn't exist`,
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

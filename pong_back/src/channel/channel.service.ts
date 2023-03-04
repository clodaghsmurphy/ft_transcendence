import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Channel } from '@prisma/client';
import { PrismaService } from "src/prisma/prisma.service";
import { ChannelCreateDto } from "./dto";

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

	async checkUser(username: string) {
		if (await this.prisma.user.count({where: {name: username}}) == 0)
		{
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `User ${username} doesn't exist`,
			}, HttpStatus.BAD_REQUEST);
		}
	}
}

import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Channel } from '@prisma/client';
import { PrismaService } from "src/prisma/prisma.service";
import { ChannelCreateDto } from "./dto";

@Injectable()
export class ChannelService {
	constructor (private prisma: PrismaService) {}

	async getAllChannels(): Promise<Channel[]> {
		return await this.prisma.channel.findMany();
	}

	async getChannel(channelName: string) : Promise<Channel> {
		return await this.prisma.channel.findUnique({
			where: { name: channelName },
		});
	}

	async createChannel(dto: ChannelCreateDto) : Promise<Channel> {
		if (await this.prisma.user.count({where: {name: dto.username}}) == 0)
		{
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `User ${dto.username} doesn't exist`,
			}, HttpStatus.BAD_REQUEST);
		}
		try {
			return await this.prisma.channel.create({
				data: {
					name: dto.name,
					operators: [dto.username],
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
}

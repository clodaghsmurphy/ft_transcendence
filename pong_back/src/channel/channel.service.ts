import { Injectable } from "@nestjs/common";
import { Channel } from '@prisma/client';
import { PrismaService } from "src/prisma/prisma.service";

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
}

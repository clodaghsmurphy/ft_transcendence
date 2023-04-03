import { HttpException, HttpStatus, Injectable, Res } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { PrismaService } from "src/prisma/prisma.service";
import { UserCreateDto, UserUpdateDto } from "./dto";
import * as path from 'path';
import * as fs from 'fs';
import { HttpService} from '@nestjs/axios'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService,
		private readonly httpService: HttpService) {
	}

	async getAll(): Promise<User[]> {
		return await this.prisma.user.findMany();
	}

	async get(id: number): Promise<User> {
		await this.checkUser(id);

		return await this.prisma.user.findUnique({
			where: { id: id },
		});
	}

	async userExists(id: number): Promise<User> {
		const user = await this.prisma.user.findUnique({
			where: { id: id },
		});
		return user;
	}

	async getInfo(id: number, attribute: string) {
		await this.checkUser(id);

		const user = await this.prisma.user.findUnique({
			where: { id: id },
		});
		if (user == null)
			return ;
		return { attribute: user[attribute] };
	}

	async downloadImage(cdn:string): Promise<string>
	{
		const split = cdn.split('/');
		const name = split[split.length -1];
		const pathname = path.join('/app', 'uploads', name)
		const writer = fs.createWriteStream(pathname);

        const response = await this.httpService.axiosRef({
            url: cdn,
            method: 'GET',
            responseType: 'stream',
        });

        response.data.pipe(writer);
        return pathname;
	}

	async create(dto: UserCreateDto): Promise<User> {
		try {

			return await this.prisma.user.create({
				data: {
					name: dto.name,
					id: dto.id,
					avatar: dto.avatar,
				},
			});
		} catch (e) {
			if (e.code === 'P2002') {
				throw new HttpException({
					status: HttpStatus.BAD_REQUEST,
					error: `User ${dto.name} already exists`,
				}, HttpStatus.BAD_REQUEST);
			}
			throw e;
		}
	}

	async update(dto: UserUpdateDto): Promise<User> {
		await this.checkUser(dto.id);
		return await this.prisma.user.update({
			where: { id: dto.id },
			data: dto,
		});
	}

	// This should only be called by channel service
	// Therefore it assumes user and channel both exists
	async joinChannel(id: number, channelName: string) {
		await this.prisma.user.update({
			where: { id: id },
			data: {
				channels: {push: channelName}
			},
		});
	}

	// async joinGame(id: number, roomId: number) {
	// 	await this.prisma.user.update({
	// 		where: { id: id },
	// 		data: {
	// 			games: {push: roomId}
	// 		},
	// 	});
	// }

	// Same here, should only be called by channel
	async leaveChannel(id: number, channelName: string) {
		const user: User = await this.prisma.user.findUnique({where: {id: id}});

		await this.prisma.user.update({
			where: {id: id},
			data: {
				channels: {set: user.channels.filter((name) => name !== channelName)}
			}
		});
	}

	async checkUser(id: number) {
		if (await this.prisma.user.count({where: {id: id}}) == 0) {
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `User ${id} doesn't exist`,
			}, HttpStatus.BAD_REQUEST);
		}
	}

}

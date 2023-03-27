import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Game, Message } from '@prisma/client';
import { PrismaService } from "src/prisma/prisma.service";
import { GameCreateDto, GameJoinDto, GameLeaveDto, MovementDto } from "./dto";
import * as bcrypt from 'bcrypt';
import { UserService } from "src/user/user.service";

@Injectable()
export class GameService {
	constructor (private prisma: PrismaService, private userService: UserService) {}

	async getAll(): Promise<unknown[]> {
		const channels: Game[] = await this.prisma.game.findMany();

		return game.map((game) => this.returnInfo(game));
	}

	async get(channelName: string) : Promise<unknown> {
		await this.checkGame(channelName);

		const channel: Game = await this.prisma.channel.findUnique({
			where: { name: channelName },
		});

		return this.returnInfo(channel);
	}

	async getInfo(channelName: string, attribute: string) {
		await this.checkGame(channelName);

		const channel: Game = await this.prisma.channel.findUnique({
			where: {name: channelName},
		});
		return {attribute: channel[attribute]};
	}

	async create(dto: GameCreateDto) : Promise<unknown> {
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

			const channel: Game = await this.prisma.channel.create({data: data});
			dto.users_ids.forEach(async(user) => await this.userService.joinGame(user, dto.name));
			return this.returnInfo(channel);
		} catch (e) {
			if (e.code == 'P2002') {
				throw new HttpException({
					status: HttpStatus.BAD_REQUEST,
					error: `Game ${dto.name} already exists`,
				}, HttpStatus.BAD_REQUEST);
			}
			throw e;
		}
	}

	async join(dto: GameJoinDto) : Promise<unknown> {
		await this.checkUser(dto.user_id);
		await this.checkGame(dto.name);

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

		const channel: Game = await this.prisma.channel.update({
			where: {name: dto.name},
			data: {
				members: {push: dto.user_id}
			},
		});
		this.userService.joinGame(dto.user_id, dto.name);

		return this.returnInfo(channel);
	}

	async leave(dto: GameLeaveDto) : Promise<unknown> {
		await this.checkUserInGame(dto.user_id, dto.name);

		const channel: Game = await this.prisma.channel.findUnique({where: {name: dto.name}});

		const updateGame: Game = await this.prisma.channel.update({
			where: {name: dto.name},
			data: {
				members: {set: channel.members.filter((id) => id !== dto.user_id)},
				operators: {set: channel.members.filter((id) => id !== dto.user_id)},
			},
		});

		return this.returnInfo(updateGame);
	}

	async getAllMessages(channelName: string) : Promise<Message[]> {
		await this.checkGame(channelName);

		const channel: Game = await this.prisma.channel.findUnique({where: {name: channelName}});
		const messageIds: number[] = channel.messages;

		return await this.prisma.message.findMany({
			where: {
				id: {in: messageIds},
			},
		});
	}

	async postMessage(dto: MessageCreateDto) : Promise<Message> {
		await this.checkUserInGame(dto.sender_id, dto.name);

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

	async checkGame(channelName: string) {
		if (await this.prisma.channel.count({where: {name: channelName}}) == 0)
		{
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `Game ${channelName} doesn't exist`,
			}, HttpStatus.BAD_REQUEST);
		}
	}

	async checkUserInGame(userId: number, channelName: string) {
		await this.checkUser(userId);
		await this.checkGame(channelName);

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

	async checkPassword(dto: GameJoinDto) {
		const channel = await this.prisma.channel.findUnique({where: {name: dto.name}});

		if (channel.password === null)
			return true;

		if (!dto.hasOwnProperty('password'))
			return false;

		return await bcrypt.compare(dto.password, channel.password);
	}

	returnInfo(channel: Game) {
		let data: any = channel;

		data.password = (channel.password === null ? false : true);
		return data;
	}
}

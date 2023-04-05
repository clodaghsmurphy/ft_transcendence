import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Game } from '@prisma/client';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { PrismaService } from "src/prisma/prisma.service";
import { GameCreateDto, GameJoinDto, GameLeaveDto, MovementDto } from "./dto";
import { UserService } from "src/user/user.service";
import * as path from 'path';
import * as fs from 'fs';
import { HttpService} from '@nestjs/axios'


@Injectable()
export class GameService {
  constructor(private prisma: PrismaService, private userService: UserService) {}

	async getAllGames(): Promise<Game[]> {
		return await this.prisma.game.findMany();
	}
	
	returnInfo(game: Game) {
		let data: any = game;
		return data;
	}
	  
	async getGameById(id_search: number): Promise<unknown> {
		await this.checkGame(id_search);
		
		const game: Game = await this.prisma.game.findUnique({
			where: { id: id_search },
		});
		
		return this.returnInfo(game);
	}

	async deleteGameById(id_search: number): Promise<Game> {
		return await this.prisma.game.delete({
			where: { id: id_search },
		});
	}


	async checkUser(id_search: number) {
		if (await this.prisma.user.count({where: {id: id_search}}) == 0)
		{
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `User ${id_search} doesn't exist`,
			}, HttpStatus.BAD_REQUEST);
		}
	}

	async checkGame(id_search: number) {
		if (await this.prisma.game.count({where: {id: id_search}}) == 0)
		{
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `Game ${id_search} doesn't exist`,
			}, HttpStatus.BAD_REQUEST);
		}
	}

  	async checkUserInChannel(userId: number, roomId: number) {
		await this.checkUser(userId);
		await this.checkGame(roomId);

		if (await this.prisma.game.count({where: {
			id: roomId,
			members: {has: userId}
		}}) == 0)
		{
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `User ${userId} has not joined game ${roomId}`,
			}, HttpStatus.BAD_REQUEST);
		}
	}

	async checkCanJoin(dto: GameJoinDto) {
		await this.checkUser(dto.user_id); // Check user exist
		await this.checkGame(dto.room_id);  // Check party exist or create it

		const game = await this.prisma.game.findUnique({where: {id: dto.room_id}}); // Isolate game

		// Check that user isn't already joined
		if (await this.prisma.game.count({where: {
				id: dto.room_id,
				members: {has: dto.user_id}
			}}) > 0)
		{
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `User ${dto.user_id} has already joined game ${dto.room_id}`,
			}, HttpStatus.BAD_REQUEST);
		}
		// Check if the game as already 2 players
		if (game.members.length >= 2) {
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `Game ${dto.room_id} is full. Cannot join.`,
			}, HttpStatus.BAD_REQUEST);
		}
	}

	
	async join(dto: GameJoinDto) : Promise<unknown> {
		await this.checkCanJoin(dto);

		const channel: Game = await this.prisma.game.update({
			where: {id: dto.room_id},
			data: {
				members: {push: dto.user_id}
			},
		});
		// this.userService.joinGame(dto.user_id, dto.room_id);

		return this.returnInfo(channel);
	}

}


/*

	Veut rejoindre parti : 
		- Check joueur existe : 
		- Check si joueur deja dans partie

		- Check si parti accesible : 
			Check si >= 2 jours 
				Oui : 
					Return nop
				OK
					Cree partie :


*/
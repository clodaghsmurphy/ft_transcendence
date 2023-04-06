import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { GameCreateDto } from "./dto";
import { GameRoom } from "./types/game.types";
import { use } from "passport";

@Injectable()
export class GameService {
	constructor(private prisma: PrismaService, private userService: UserService) {}

	public activeGames: Map<number, GameRoom> = new Map<number, GameRoom>();

	async getAll() {
		return await this.prisma.game.findMany({where: {ongoing: true}});
	}

	async get(id: number) {
		return await this.prisma.game.findUnique({where: {id: id}});
	}

	async create(dto) {
		await this.checkUserInGame(dto.user_id);
		await this.checkUserInGame(dto.target_id);

		const game = await this.prisma.game.create({
			data: {
				player1: dto.user_id,
				player2: dto.target_id,
			}
		});

		await this.prisma.user.update({
			where: {id: dto.user_id | dto.target_id},
			data: {game_id: game.id}
		});
		return game;
	}

	async remove(id: number) {
		const game = await this.prisma.game.update({
			where: {id: id},
			data: {ongoing: false},
		});

		// await this.prisma.user.update({
		// 	where: {id: game.player1 | game.player2},
		// 	data: {}
		// })
	}

	async checkGame(id: number) {
		if (await this.prisma.game.count({where: {id: id}}) == 0) {
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `Game ${id} doesn't exist`,
			}, HttpStatus.BAD_REQUEST);
		}
	}

	async checkUserInGame(userId: number) {
		await this.userService.checkUser(userId);

		const user = await this.userService.get(userId);
		if (user.game_id !== null) {
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `User ${userId} is already in game ${user.game_id}`,
			}, HttpStatus.BAD_REQUEST);
		}
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

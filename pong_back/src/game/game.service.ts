import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { GameCreateDto } from "./dto";
import { GameRoom } from "./types/game.types";

@Injectable()
export class GameService {
	constructor(private prisma: PrismaService, private userService: UserService) {}

	public activeGames: Map<number, GameRoom> = new Map<number, GameRoom>();

	async getAll() {
		return await this.prisma.game.findMany();
	}

	async get(id: number) {
		return await this.prisma.game.findUnique({where: {id: id}});
	}

	async create(dto) {
		await this.checkUserInGame(dto.user_id);
		await this.checkUserInGame(dto.target_id);

		const game = await this.prisma.game.create({
			data: {
				player1: {connect: {id: dto.user_id}},
				player2: {connect: {id: dto.target_id}},
			},
			include: {
				player1: true,
				player2: true,
			}
		});

		return game;
	}

	async checkGame(id: number) {
		if (await this.prisma.game.count({where: {id: id}}) == 0)
		{
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `Game ${id} doesn't exist`,
			}, HttpStatus.BAD_REQUEST);
		}
	}

	async checkUserInGame(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {id: userId},
			include: {
				player1_game: true,
				player2_game: true,
			}
		});

		if (user.player1_game != null || user.player2_game != null)
		{
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `User ${userId} is already in game`,
			}, HttpStatus.BAD_REQUEST)
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

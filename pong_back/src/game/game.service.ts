import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { GameCreateDto } from "./dto";
import { GameRoom } from "./types/game.types";
import { GameState } from "./types/game.types";
import { Namespace } from 'socket.io';

@Injectable()
export class GameService {

	private activeGames: Map<number, GameRoom> = new Map<number, GameRoom>();

	constructor(private prisma: PrismaService, private userService: UserService) {}

	async getAll() {
		return await this.prisma.game.findMany({where: {ongoing: true}});
	}

	async get(id: number) {
		return await this.prisma.game.findUnique({where: {id: id}});
	}

	async create(dto) {
		await this.checkUserNotInGame(dto.user_id);
		await this.checkUserNotInGame(dto.target_id);

		const game = await this.prisma.game.create({
			data: {
				player1: dto.user_id,
				player2: dto.target_id,
			}
		});

		await this.prisma.user.updateMany({
			where: {id: {in: [dto.target_id, dto.user_id]}},
			data: {
				game_id: game.id,
				in_game: true,
			}
		});

		const room = new GameRoom();
		room.id = game.id;
		room.player1_id = dto.user_id;
		room.player2_id = dto.target_id;
		room.rounds = 0;

		room.state = new GameState();
		room.state.ongoing = true;

		this.activeGames[room.id] = room;
		return game;
	}

	async remove(id: number) {
		const game = await this.prisma.game.update({
			where: {id: id},
			data: {ongoing: false},
		});

		await this.prisma.user.updateMany({
			where: {id: {in: [game.player1, game.player2]}},
			data: {
				game_id: null,
				in_game: false,
			}
		});

		this.activeGames.delete(game.id);
		return game;
	}

	async checkGame(id: number) {
		if (await this.prisma.game.count({where: {id: id}}) == 0) {
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `Game ${id} doesn't exist`,
			}, HttpStatus.BAD_REQUEST);
		}
	}

	async checkUserNotInGame(userId: number) {
		await this.userService.checkUser(userId);

		const user = await this.userService.get(userId);
		if (user.game_id !== null || user.in_game) {
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `User ${userId} is already in game ${user.game_id}`,
			}, HttpStatus.BAD_REQUEST);
		}
	}

	async checkUserInGame(userId: number, gameId: number) {
		await this.userService.checkUser(userId);
		await this.checkGame(gameId);

		const game = await this.prisma.game.findUnique({where: {id: gameId}});

		if (game.player1 != userId && game.player2 != userId) {
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `User ${userId} is not part of game ${gameId}`
			}, HttpStatus.BAD_REQUEST);
		}
	}

	async startGame(gameId: number, io: Namespace) {
		await this.checkGame(gameId);

		const room: GameRoom = this.activeGames[gameId];

		const intervalId = setInterval(() => {
			if (room.state.ongoing === true) {
				this.gameLoop(room);
				io.in('' + room.id).emit('update');
			} else {
				clearInterval(intervalId);
				io.in('' + room.id).emit('gameover');
			}
		}, 500);

	}

	gameLoop(room: GameRoom) {
		room.rounds++;
		if (room.rounds >= 5)
			room.state.ongoing = false;
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

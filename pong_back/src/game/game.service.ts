import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { GameCreateDto, GameKeyDto } from "./dto";
import { GameKeyEvent, GameRoom, KeyAction, KeyType, defaultState } from "./types/game.types";
import { GameState } from "./types/game.types";
import { Namespace } from 'socket.io';
import { use } from "passport";

@Injectable()
export class GameService {

	private activeGames: Map<number, GameRoom> = new Map<number, GameRoom>();

	constructor(private prisma: PrismaService, private userService: UserService) {
		this.cleanHangingGames();
	}

	async getAll() {
		return await this.prisma.game.findMany({where: {ongoing: true}});
	}

	async getAllPast() {
		return await this.prisma.game.findMany({});
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

		room.state = defaultState;

		this.activeGames.set(game.id, room);
		return game;
	}

	async remove(id: number) {
		await this.checkGame(id);

		const game = await this.prisma.game.update({
			where: {id: id},
			data: {ongoing: false},
		});

		await this.prisma.user.updateMany({
			where: {id: {in: [game.player1, game.player2]}},
			data: {
				game_id: null,
				in_game: false,
				past_games: {push: id}
			}
		});

		this.activeGames.delete(game.id);
		return game;
	}

	startGame(gameId: number, io: Namespace) {
		this.checkActiveGame(gameId);

		const room: GameRoom = this.activeGames.get(gameId);

		const intervalId = setInterval(async () => {
			if (room.state.ongoing === true) {
				this.gameLoop(room);
				io.in('' + room.id).emit('update', room.state);
			} else {
				clearInterval(intervalId);
				io.in('' + room.id).emit('gameover');
				await this.remove(room.id);
			}
		}, 500);
	}

	gameLoop(room: GameRoom) {
		// Met à jour la position de la balle en fonction de sa direction
		room.state.ball_pos_x += room.state.ball_dir_x;
		room.state.ball_pos_y += room.state.ball_dir_y;
	
		// Vérifie si la balle a atteint un bord de l'écran et la fait rebondir si c'est le cas
		if (room.state.ball_pos_x < 0 || room.state.ball_pos_x > room.state.width) {
			room.state.ball_dir_x *= -1;
		}
		if (room.state.ball_pos_y < 0 || room.state.ball_pos_y > room.state.height) {
			room.state.ball_dir_y *= -1;
		}
		
		// Vérifie si la balle est en collision avec la raquette de joueur1 et la fait rebondir si c'est le cas
		if (room.state.ball_pos_x <= room.state.racket_length && room.state.ball_pos_y >= room.state.player1_pos && room.state.ball_pos_y <= room.state.player1_pos + room.state.racket_length) {
			room.state.ball_dir_x *= -1;
		}
		
		// Vérifie si la balle est en collision avec la raquette de joueur2 et la fait rebondir si c'est le cas
		if (room.state.ball_pos_x >= room.state.width - room.state.racket_length && room.state.ball_pos_y >= room.state.player2_pos && room.state.ball_pos_y <= room.state.player2_pos + room.state.racket_length) {
			room.state.ball_dir_x *= -1;
		}
		
		// Vérifie si la balle est passée la raquette de joueur1 et incrémente les points de joueur2 si c'est le cas
		if (room.state.ball_pos_x < 0) {
			room.state.player2_goals++;
			room.state.ball_pos_x = room.state.width / 2;
			room.state.ball_pos_y = room.state.height / 2;
		}
		
		// Vérifie si la balle est passée la raquette de joueur2 et incrémente les points de joueur1 si c'est le cas
		if (room.state.ball_pos_x > room.state.width) {
			room.state.player1_goals++;
			room.state.ball_pos_x = room.state.width / 2;
			room.state.ball_pos_y = room.state.height / 2;
		}
		
		// Vérifie si le jeu est terminé et met à jour la variable ongoing de la GameState en conséquence
		if (room.state.player1_goals >= 5 || room.state.player2_goals >= 5) {
			room.state.ongoing = false;
		}
	}
	  

	keyEvent(dto: GameKeyDto) {
		const room: GameRoom = this.activeGames.get(dto.id);
		let newDir = 0;

		if (dto.keyEvent.action === KeyAction.Press) {
			if (dto.keyEvent.key === KeyType.Up) {
				newDir = -room.state.racket_speed;
			} else {
				newDir = room.state.racket_speed;
			}
		}

		if (dto.user_id === room.player1_id)
			room.state.player1_dir = newDir;
		else
			room.state.player2_dir = newDir;
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

	checkActiveGame(gameId: number) {
		if (!this.activeGames.has(gameId)) {
			console.log(`${JSON.stringify(this.activeGames)}`);
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `Game ${gameId} is not ongoing.`
			}, HttpStatus.BAD_REQUEST);
		}
	}

	checkUserIsPlayer(userId: number, gameId: number) {
		this.checkActiveGame(gameId);

		const room : GameRoom = this.activeGames.get(gameId);

		if (userId != room.player1_id && userId != room.player2_id) {
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `User ${userId} is not a player`
			}, HttpStatus.BAD_REQUEST);
		}
	}

	async cleanHangingGames() {
		const games = await this.prisma.game.findMany({where: {ongoing: true}});
		games.forEach((game) => this.remove(game.id));
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

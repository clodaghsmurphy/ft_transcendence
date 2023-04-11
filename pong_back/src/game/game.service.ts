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

		room.state = {...defaultState};
		[room.state.ball_dir_x, room.state.ball_dir_y] = this.getRandomDirection(room.state.ball_speed);

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
				this.gameLoop(room.state);
				io.in('' + room.id).emit('update', room.state);
			} else {
				clearInterval(intervalId);
				io.in('' + room.id).emit('gameover');
				await this.remove(room.id);
			}
		}, 34);
	}

	gameLoop(state: GameState) {
		state.rounds++;

		if (state.current_pause > 0) {
			--state.current_pause;
			return ;
		}

		this.movePaddles(state);

		this.checkBallCollision(state);

		this.checkGoal(state);

		state.ball_pos_x += state.ball_dir_x;
		state.ball_pos_y += state.ball_dir_y;

		// Vérifie si le jeu est terminé et met à jour la variable ongoing de la GameState en conséquence
		if (state.player1_goals >= 5 || state.player2_goals >= 5 || state.rounds >= 2000) {
			state.ongoing = false;
		}
	}

	movePaddles(state: GameState) {
		// Bouge la raquette de joueur1
		state.player1_pos += state.player1_dir;
		if (state.player1_pos < state.racket_length / 2)
			state.player1_pos -= state.player1_dir;
		if (state.player1_pos > state.height - (state.racket_length / 2))
			state.player1_pos -= state.player1_dir;

		// Bouge la raquette de joueur2
		state.player2_pos += state.player2_dir;
		if (state.player2_pos < state.racket_length / 2)
			state.player2_pos -= state.player2_dir;
		if (state.player2_pos > state.height - state.racket_length / 2)
			state.player2_pos -= state.player2_dir;
	}

	checkBallCollision(state: GameState) {
		// Vérifie si la balle a atteint un bord de l'écran et la fait rebondir si c'est le cas
		const half_length = state.racket_length / 2;
		const half_radius = state.ball_radius / 2;

		if (state.ball_pos_y - half_radius <= 0 || state.ball_pos_y + half_radius >= state.height) {
			state.ball_dir_y *= -1;
		}

		// Vérifie si la balle est en collision avec la raquette de joueur1 et la fait rebondir si c'est le cas
		if (state.ball_pos_x - half_radius <= state.racket_width + state.racket_shift &&
			state.ball_pos_y + half_radius >= state.player1_pos - half_length &&
			state.ball_pos_y - half_radius <= state.player1_pos + half_length &&
			state.ball_dir_x < 0) {

				// Check if it hits top of paddle
				if (state.ball_pos_y < state.player1_pos - half_length / 2) {
					state.ball_dir_x = state.ball_speed / 2;
					state.ball_dir_y = state.ball_speed * -0.5;
				} else if (state.ball_pos_y > state.player1_pos + half_length / 2) {
					state.ball_dir_x = state.ball_speed / 2;
					state.ball_dir_y = state.ball_speed / 2;
				} else {
					state.ball_dir_x = state.ball_speed - Math.abs(state.ball_dir_y);
				}
		}

		if (state.ball_pos_x + half_radius >= state.height - state.racket_width - state.racket_shift &&
			state.ball_pos_y + half_radius >= state.player2_pos - half_length &&
			state.ball_pos_y - half_radius <= state.player2_pos + half_length &&
			state.ball_dir_x > 0) {

				// Check if it hits top of paddle
				if (state.ball_pos_y < state.player2_pos - half_length / 2) {
					state.ball_dir_x = -(state.ball_speed / 2);
					state.ball_dir_y = state.ball_speed * -0.5;
				} else if (state.ball_pos_y > state.player2_pos + half_length / 2) {
					state.ball_dir_x = -(state.ball_speed / 2);
					state.ball_dir_y = state.ball_speed / 2;
				} else {
					state.ball_dir_x = -(state.ball_speed - Math.abs(state.ball_dir_y));
				}
		}
	}

	checkGoal(state: GameState) {
		let goal: boolean = false;
		const half_radius: number = state.ball_radius / 2;

		// Vérifie si la balle est passée la raquette de joueur1 et incrémente les points de joueur2 si c'est le cas
		if (state.ball_pos_x - half_radius < 0) {
			state.player2_goals++;
			goal = true;
		}

		// Vérifie si la balle est passée la raquette de joueur2 et incrémente les points de joueur1 si c'est le cas
		if (state.ball_pos_x + half_radius > state.width) {
			state.player1_goals++;
			goal = true;
		}

		// Reset the game state
		if (goal) {
			state.ball_pos_x = state.width / 2;
			state.ball_pos_y = state.height / 2;

			[state.ball_dir_x, state.ball_dir_y] = this.getRandomDirection(state.ball_speed);
			state.current_pause = state.pause_frames;

			state.player1_pos = defaultState.player1_pos;
			state.player2_pos = defaultState.player2_pos;
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

	getRandomDirection(ballSpeed: number) : [number, number]  {
		const x = Math.random() * (ballSpeed * 2 + 1) - ballSpeed;
		let y = ballSpeed - Math.abs(x);

		const neg = Math.floor(Math.random() * 2);
		if (neg == 1)
			y *= -1;

		if (Math.abs(x) + Math.abs(y) != ballSpeed) {
			console.log(`x: ${x}, y: ${y}, abs(x) + abs(y): ${Math.abs(x) + Math.abs(y)}`);
		}

		return [x, y];
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

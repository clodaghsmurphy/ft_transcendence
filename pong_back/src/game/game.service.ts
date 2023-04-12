import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { GameCreateDto, GameKeyDto } from "./dto";
import { GameKeyEvent, GameRoom, KeyAction, KeyType, defaultState, max_ball_radius, max_racket_length, min_ball_radius, min_racket_length } from "./types/game.types";
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
		this.initState(room.state);

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
		if (state.player1_goals >= state.winning_goals || state.player2_goals >= state.winning_goals) {
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
		const half_length = state.racket_length / 2;
		const half_radius = state.ball_radius / 2;

		// Vérifie si la balle a atteint un bord de l'écran et la fait rebondir si c'est le cas
		if (state.ball_pos_y - half_radius <= 0 || state.ball_pos_y + half_radius >= state.height) {
			state.ball_dir_y *= -1;
		}

		// Collision joueur1
		if (state.ball_pos_x - half_radius <= state.racket_width + state.racket_shift &&
			state.ball_pos_y + half_radius >= state.player1_pos - half_length &&
			state.ball_pos_y - half_radius <= state.player1_pos + half_length &&
			state.ball_dir_x < 0) {

			// Increments speed on gamemode
			if (state.mode_speedup) {
				state.ball_speed += state.ball_initial_speed * 0.2;
			}

			// Shrink ball size on gamemode
			if (state.mode_shrink && state.ball_radius > min_ball_radius) {
				state.ball_radius -= state.ball_initial_radius / 10;
			}

			// Calcule la position relative de la balle par rapport à la raquette de joueur1
			const relativePos = (state.ball_pos_y - state.player1_pos) / state.racket_length;
			// Calcule le ratio en fonction de la position relative
			const ratio = relativePos * 50;
			// Limite la valeur du ratio entre -50 et 50
			const clampedRatio = Math.max(-50, Math.min(50, ratio));

			// Modifie la direction de la balle en fonction du ratio
			state.ball_dir_x = state.ball_speed / 2;
			state.ball_dir_y = state.ball_speed * (clampedRatio / 100);

			// Facteur de vitesse entre 1 et 2 en fonction du ratio
			const speedFactor = 1 + (Math.abs(clampedRatio) / 100);
			state.ball_dir_x *= speedFactor;
			state.ball_dir_y *= speedFactor;
		}

		// Collision joueur 2
		if (state.ball_pos_x + half_radius >= state.height - state.racket_width - state.racket_shift &&
			state.ball_pos_y + half_radius >= state.player2_pos - half_length &&
			state.ball_pos_y - half_radius <= state.player2_pos + half_length &&
			state.ball_dir_x > 0) {

			if (state.mode_speedup) {
				state.ball_speed += state.ball_initial_speed * 0.2;
			}

			if (state.mode_shrink && state.ball_radius > min_ball_radius) {
				state.ball_radius -= state.ball_initial_radius / 10;
			}

			// Calcule la position relative de la balle par rapport à la raquette de joueur2
			const relativePos = (state.ball_pos_y - state.player2_pos) / state.racket_length;
			// Calcule le ratio en fonction de la position relative
			const ratio = relativePos * 50;
			// Limite la valeur du ratio entre -50 et 50
			const clampedRatio = Math.max(-50, Math.min(50, ratio));

			// Modifie la direction de la balle en fonction du ratio
			state.ball_dir_x = -state.ball_speed / 2;
			state.ball_dir_y = state.ball_speed * (clampedRatio / 100);

			// Facteur de vitesse entre 1 et 2 en fonction du ratio
			const speedFactor = 1 + (Math.abs(clampedRatio) / 100);
			state.ball_dir_x *= speedFactor;
			state.ball_dir_y *= speedFactor;
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
			this.initState(state);
		}
	}

	initState(state: GameState) {
		state.player1_pos = defaultState.player1_pos;
		state.player2_pos = defaultState.player2_pos;

		state.ball_pos_x = state.width / 2;
		state.ball_pos_y = state.height / 2;

		if (state.mode_shrink) {
			state.ball_radius = max_ball_radius;
			state.ball_initial_radius = max_ball_radius;
		}
		if (state.mode_chaos) {
			state.ball_speed = this.getRandomCapped(10, 20);
			state.racket_speed = this.getRandomCapped(10, 30);
			state.ball_radius = this.getRandomCapped(min_ball_radius, max_ball_radius);
			state.racket_length = this.getRandomCapped(min_racket_length, max_racket_length);
		} else {
			state.ball_speed = state.ball_initial_speed;
			state.ball_radius = state.ball_initial_radius;
		}

		[state.ball_dir_x, state.ball_dir_y] = this.getRandomDirection(state.ball_speed);
		state.current_pause = state.pause_frames;
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

		// if (dto.user_id === room.player1_id)
			room.state.player1_dir = newDir;
		// else
			room.state.player2_dir = newDir;
	}

	getRandomDirection(ballSpeed: number): [number, number] {
		let angle: number;
		if (Math.random() < 0.5) {
			// Si c'est le joueur de gauche qui effectue le service
			angle = (Math.random() * 90 - 45) * Math.PI / 180; // angle entre -45 et 45 degrés converti en radians
		} else {
			// Sinon, c'est le joueur de droite qui effectue le service
			angle = (Math.random() * 90 + 135) * Math.PI / 180; // angle entre 135 et 225 degrés converti en radians
		}

		// Calcule les composantes x et y de la direction en fonction de l'angle
		let x = Math.cos(angle) * ballSpeed;
		let y = Math.sin(angle) * ballSpeed;

   		return [x, y];
	}

	getRandomCapped(minValue: number, maxValue: number) {
		return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
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

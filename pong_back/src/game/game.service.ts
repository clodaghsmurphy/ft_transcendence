import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { GameKeyDto } from "./dto";
import { GameRoom, KeyAction, KeyType, defaultState, max_ball_radius, max_ball_speed, max_racket_length, max_racket_speed, min_ball_radius, min_ball_speed, min_racket_length, min_racket_speed } from "./types/game.types";
import { GameState } from "./types/game.types";
import { Namespace } from 'socket.io';
import { getNextRatings } from "./rating";
import * as deepEqual from 'deep-equal';

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
		await this.userService.checkUser(dto.user_id);

		const user = await this.userService.get(dto.user_id);
		if (user.game_id !== null) {
			return {id: user.game_id};
		}

		if (!dto.hasOwnProperty('target_id')) {
			return await this.createSoloGame(dto);
		}
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
		room.player1_ready = false;
		room.player2_ready = false;
		room.has_started = false;
		room.state = {...dto.state};

		this.activeGames.set(game.id, room);
		return game;
	}

	async createSoloGame(dto) {
		for (const [gameId, gameRoom] of this.activeGames.entries()) {
			if (gameRoom.player2_id === -1 &&
				((gameRoom.state.mode_chaos && dto.state.mode_chaos) || deepEqual(gameRoom.state, dto.state))) {
				return await this.joinAsPlayer2(gameRoom, dto.user_id);
			}
		}

		const game = await this.prisma.game.create({
			data: {player1: dto.user_id}
		});

		await this.prisma.user.update({
			where: {id: dto.user_id},
			data: {
				in_game: true,
				game_id: game.id
			}
		});

		const room = new GameRoom();
		room.id = game.id;
		room.player1_id = dto.user_id;
		room.player2_id = -1;
		room.player1_ready = false;
		room.player2_ready = false;
		room.has_started = false;
		room.state = {...dto.state};

		this.activeGames.set(game.id, room);
		return game;
	}

	async join(gameId: number, userId: number) {
		this.checkActiveGame(gameId);

		const room: GameRoom = this.activeGames.get(gameId);
		if (userId != room.player1_id && room.player2_id === -1) {
			await this.joinAsPlayer2(room, userId);
		}

		if (room.player1_id === userId) {
			room.player1_ready = true;
		} else if (room.player2_id === userId) {
			room.player2_ready = true;
		}

		return room;
	}

	async joinAsPlayer2(room: GameRoom, userId: number) {
		room.player2_id = userId;

		const game = await this.prisma.game.update({
			where: {id: room.id},
			data: {
				player2: userId,
			}
		});

		await this.prisma.user.update({
			where: {id: userId},
			data: {
				in_game: true,
				game_id: game.id
			}
		})

		return game;
	}

	async remove(id: number) {
		await this.checkGame(id);

		const gameRoom: GameRoom = this.activeGames.get(id);

		if (!gameRoom || (gameRoom.state.player1_goals !== gameRoom.state.winning_goals && gameRoom.state.player2_goals !== gameRoom.state.winning_goals)) {
			const game = await this.prisma.game.delete({
				where: {id: id}
			});

			let users;

			if (game.player2 !== null) {
				users = [game.player1, game.player2];
			} else {
				users = [game.player1];
			}

			await this.prisma.user.updateMany({
				where: {id: {in: users}},
				data: {
					game_id: null,
					in_game: false,
				}
			});

			if (this.activeGames.has(game.id)) {
				this.activeGames.delete(game.id);
			}
			return game;
		}

		const game = await this.updateStats(id);

		await this.prisma.user.updateMany({
			where: {id: {in: [game.player1, game.player2]}},
			data: {
				game_id: null,
				in_game: false,
				past_games: {push: id}
			}
		});

		if (this.activeGames.has(game.id)) {
			this.activeGames.delete(game.id);
		}
		return game;
	}

	async updateStats(id: number) {
		const gameRoom: GameRoom = this.activeGames.get(id);

		const player1_win: number = gameRoom.state.player1_goals === gameRoom.state.winning_goals ? 1 : 0;
		const player2_win: number = 1 - player1_win;

		const player1 = await this.prisma.user.findUnique({where: {id: gameRoom.player1_id}});
		const player2 = await this.prisma.user.findUnique({where: {id: gameRoom.player2_id}});

		const player1_past_stats = await this.prisma.stats.findUnique({where: {userId: player1.id}});
		const player2_past_stats = await this.prisma.stats.findUnique({where: {userId: player2.id}});

		const player1_streak = player1_win ? player1_past_stats.current_streak + 1 : 0;
		const player2_streak = player2_win ? player2_past_stats.current_streak + 1 : 0;

		const [
			next_player1_rating,
			player1_rating_change,
			next_player2_rating,
			player2_rating_change
		] = getNextRatings(player1_past_stats.rating, player2_past_stats.rating, player1_win);


		await this.prisma.stats.update({
			where: {id: player1_past_stats.id},
			data: {
				wins: player1_past_stats.wins + player1_win,
				total_games: player1_past_stats.total_games + 1,
				points: player1_past_stats.points + gameRoom.state.player1_goals,
				lvl: player1_past_stats.lvl + player1_win,
				rating: next_player1_rating,
				current_streak: player1_streak,
				max_streak: Math.max(player1_streak, player1_past_stats.max_streak),
			}
		});

		await this.prisma.stats.update({
			where: {id: player2_past_stats.id},
			data: {
				wins: player2_past_stats.wins + player2_win,
				total_games: player2_past_stats.total_games + 1,
				points: player2_past_stats.points + gameRoom.state.player2_goals,
				lvl: player2_past_stats.lvl + player2_win,
				rating: next_player2_rating,
				current_streak: player2_streak,
				max_streak: Math.max(player2_streak, player2_past_stats.max_streak),
			}
		});

		const game = await this.prisma.game.update({
			where: {id: id},
			data: {
				ongoing: false,
				player1_goals: gameRoom.state.player1_goals,
				player2_goals: gameRoom.state.player2_goals,
				winner: (player1_win === 1 ? player1.id : player2.id),
				player1_rating_change: player1_rating_change,
				player2_rating_change: player2_rating_change,
			},
		});

		return game;
	}

	readyToStart(gameId: number) {
		this.checkActiveGame(gameId);

		const room: GameRoom = this.activeGames.get(gameId);
		return (!room.has_started && room.player2_id !== -1 && room.player1_ready && room.player2_ready);
	}

	startGame(gameId: number, io: Namespace) {
		this.checkActiveGame(gameId);

		const room: GameRoom = this.activeGames.get(gameId);

		room.has_started = true;
		io.in('' + gameId).emit('gamestart', room);
		this.initState(room.state);

		const intervalId = setInterval(async () => {
			if (room.state.ongoing === true) {
				this.gameLoop(room.state);
				io.in('' + room.id).emit('update', room.state);
			} else {
				clearInterval(intervalId);
				const winner = room.state.player1_goals === room.state.winning_goals ? room.player1_id : room.player2_id;

				io.in('' + room.id).emit('gameover', {
					winner: winner,
					player1: room.player1_id,
					player2: room.player2_id,
					player1_goals: room.state.player1_goals,
					player2_goals: room.state.player2_goals,
				});
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
		this.moveObstacles(state);
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
		const half_length = state.racket_length / 2;
		// Bouge la raquette de joueur1
		state.player1_pos += state.player1_dir;
		if (state.player1_pos < half_length || state.player1_pos > state.height - half_length)
			state.player1_pos -= state.player1_dir;

		// Bouge la raquette de joueur2
		state.player2_pos += state.player2_dir;
		if (state.player2_pos < half_length || state.player2_pos > state.height - half_length)
			state.player2_pos -= state.player2_dir;
	}

	moveObstacles(state: GameState) {
		state.obstacles.forEach((obstacle) => {
			const half_length = obstacle.length / 2;
			const half_width = obstacle.width / 2;

			obstacle.pos_x += obstacle.dir_x;
			obstacle.pos_y += obstacle.dir_y;
			if (obstacle.pos_x < half_width || obstacle.pos_x > state.width - half_width) {
				obstacle.dir_x *= -1;
				obstacle.pos_x += obstacle.dir_x
			}

			if (obstacle.pos_y < half_length || obstacle.pos_y > state.height - half_length) {
				obstacle.dir_y *= -1;
				obstacle.pos_y += obstacle.dir_y
			}
		});
	}

	intersectionSegment(a1x: number, a1y: number, a2x: number, a2y: number, b1x: number, b1y: number, b2x: number, b2y: number) : { x: number, y: number } | null {
		var den = (b2y - b1y) * (a2x - a1x) - (b2x - b1x) * (a2y - a1y);
		var num1 = (b2x - b1x) * (a1y - b1y) - (b2y - b1y) * (a1x - b1x);
		var num2 = (a2x - a1x) * (a1y - b1y) - (a2y - a1y) * (a1x - b1x);

		if (den === 0) {
			// Les segments sont parallèles
			return num1 === 0 && num2 === 0 ? { x: null, y: null } : { x: null, y: null };
		}

		var r = num1 / den;
		var s = num2 / den;

		if (r >= 0 && r <= 1 && s >= 0 && s <= 1) 
		{
			// Les segments se croisent
			var intersectionX = a1x + r * (a2x - a1x);
			var intersectionY = a1y + r * (a2y - a1y);
			return { x: intersectionX, y: intersectionY };
		}
		return null;
	}

	// Fonction pour calculer la distance euclidienne entre deux coordonnées (x, y)
	distanceEuclidienne(x1: number, y1: number, x2: number, y2: number): number {
		const deltaX = x2 - x1;
		const deltaY = y2 - y1;
	
		// Utilisation du théorème de Pythagore pour calculer la distance euclidienne
		const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
	
		return distance;
	}

	intersectionRectangleBall(state: GameState, rectangle_x : number, player_pos: number, length: number, width: number)
	{
		const half_length = length / 2;
		const half_radius = state.ball_radius / 2;
		const gauche = state.ball_dir_x < 0;
		const haut = state.ball_dir_y < 0;

		const rectangle = {
			haut_gauche : {
				x : rectangle_x,
				y : player_pos - half_length,
			},
			haut_droit : {
				x : rectangle_x + width,
				y : player_pos - half_length,
			},
			bas_gauche : {
				x : rectangle_x,
				y : player_pos + half_length,
			},
			bas_droit : {
				x : rectangle_x + width,
				y : player_pos + half_length,
			},
		};

		const next_ball_x = state.ball_pos_x + state.ball_dir_x;
		const next_ball_y = state.ball_pos_y + state.ball_dir_y;

		const ball_rectangle = {
			bas_gauche : {
				x : next_ball_x - half_radius,
				y : next_ball_y - half_radius,
				x_current : state.ball_pos_x - half_radius,
				y_current : state.ball_pos_y - half_radius,
			},
			bas_droit : {
				x : next_ball_x + half_radius,
				y : next_ball_y - half_radius,
				x_current : state.ball_pos_x + half_radius,
				y_current : state.ball_pos_y - half_radius,
			},
			haut_droit: {
				x : next_ball_x + half_radius,
				y : next_ball_y + half_radius,
				x_current : state.ball_pos_x + half_radius,
				y_current : state.ball_pos_y + half_radius,
			},
			haut_gauche: {
				x : next_ball_x - half_radius,
				y : next_ball_y + half_radius,
				x_current : state.ball_pos_x - half_radius,
				y_current : state.ball_pos_y + half_radius,
			},
		}

		let largeur_ball: {x1:number, y1: number, x2: number, y2: number, largeur:boolean}; // commence de gauche a droite
		let hauteur_ball: {x1:number, y1: number, x2: number, y2: number, largeur:boolean}; // commence de bas en haut
		let largeur_rect: {x1:number, y1: number, x2: number, y2: number, largeur:boolean}; // commence de gauche a droite
		let hauteur_rect: {x1:number, y1: number, x2: number, y2: number, largeur:boolean}; // commence de bas en haut

		if (haut)
		{
			largeur_ball = {x1: ball_rectangle.haut_gauche.x_current, y1: ball_rectangle.haut_gauche.y_current, x2: ball_rectangle.haut_droit.x_current, y2: ball_rectangle.haut_droit.y_current, largeur: true};
			largeur_rect = {x1: rectangle.bas_gauche.x, y1: rectangle.bas_gauche.y, x2: rectangle.bas_droit.x, y2: rectangle.bas_droit.y, largeur: true};
		}
		else
		{
			largeur_ball = {x1: ball_rectangle.bas_gauche.x_current, y1: ball_rectangle.bas_gauche.y_current, x2: ball_rectangle.bas_droit.x_current, y2: ball_rectangle.bas_droit.y_current, largeur: true};
			largeur_rect = {x1: rectangle.haut_gauche.x, y1: rectangle.haut_gauche.y, x2: rectangle.haut_droit.x, y2: rectangle.haut_droit.y, largeur: true};
		}
		if (gauche)
		{
			hauteur_ball = {x1: ball_rectangle.bas_gauche.x_current, y1: ball_rectangle.bas_gauche.y_current, x2: ball_rectangle.haut_gauche.x_current, y2: ball_rectangle.haut_gauche.y_current, largeur: false};
			hauteur_rect = {x1: rectangle.bas_droit.x, y1: rectangle.bas_droit.y, x2: rectangle.haut_droit.x, y2: rectangle.haut_droit.y, largeur: false};
		}
		else
		{
			hauteur_ball = {x1: ball_rectangle.bas_droit.x_current, y1: ball_rectangle.bas_droit.y_current, x2: ball_rectangle.haut_droit.x_current, y2: ball_rectangle.haut_droit.y_current, largeur: false};
			hauteur_rect = {x1: rectangle.bas_gauche.x, y1: rectangle.bas_gauche.y, x2: rectangle.haut_gauche.x, y2: rectangle.haut_gauche.y, largeur: false};
		} 

		// Je suis cense avoir 4 coordonnes dans chaque liste. 
		// Les coordonnes des extremites sur les cotes droite ou gauche a tester donc 2
		// Et pareillement avec le haut ou le bas donc 2

		var intersection : {x: number; y: number;} | null  = null;
		var intersection_test : {x: number; y: number;} | null ;
		var distance: number = Infinity;
		for (let i = largeur_ball.x1; i <= largeur_ball.x2; i++) {
			intersection_test = this.intersectionSegment(i, largeur_ball.y1, i + state.ball_dir_x, largeur_ball.y1 + state.ball_dir_y, largeur_rect.x1, largeur_rect.y1, largeur_rect.x2, largeur_rect.y2);
			if (intersection_test)
			{
				const distance_test = this.distanceEuclidienne(intersection_test.x, intersection_test.y, i, largeur_ball.y1)
				if (intersection === null)
				{
					intersection = intersection_test;
					distance = distance_test;
				}
				else if (distance > distance_test)
				{
					intersection = intersection_test;
					distance = distance_test;
				}
			}
		}
		
		for (let i = hauteur_ball.y1; i <= hauteur_ball.y2; i++) {
			intersection_test = this.intersectionSegment(hauteur_ball.x1, i, hauteur_ball.x1 + state.ball_dir_x, i + state.ball_dir_y, hauteur_rect.x1, hauteur_rect.y1, hauteur_rect.x2, hauteur_rect.y2);
			if (intersection_test)
			{
				const distance_test = this.distanceEuclidienne(intersection_test.x, intersection_test.y, i, hauteur_ball.y1)
				if (intersection === null)
				{
					intersection = intersection_test;
					distance = distance_test;
				}
				else if (distance > distance_test)
				{
					intersection = intersection_test;
					distance = distance_test;
				}
			}
			// intersection_test = this.intersectionSegment(hauteur_ball.x1, i, hauteur_ball.x1 + ball.dir_x, i + ball.dir_y, largeur_rect.x1, largeur_rect.y1, largeur_rect.x2, largeur_rect.y2);
			// if (intersection_test)
			// 	if (intersection === null || (intersection && intersection.dist > intersection_test.dist))
			// 		intersection = intersection_test;
		}
		return intersection;
	}

	checkBallCollision(state: GameState) {
		const half_radius = state.ball_radius / 2;

		// Vérifie si la balle a atteint un bord de l'ecran et la fait rebondir si c'est le cas
		const next_ball_y = state.ball_pos_y + state.ball_dir_y;

		if (next_ball_y - half_radius <= 0 && state.ball_dir_y < 0) {
			state.ball_pos_y = half_radius;
			state.ball_dir_y *= -1;
			return ;
		}
		if (next_ball_y + half_radius >= state.height && state.ball_dir_y > 0) {
			state.ball_pos_y = state.height - half_radius;
			state.ball_dir_y *= -1;
			return ;
		}


		// Position and length of object that interesect
		let intersect_pos = state.player1_pos;
		let intersect_length = state.racket_length;

		// Get intersection coord with player1 or player2
		let intersection = this.intersectionRectangleBall(state, state.racket_shift, state.player1_pos,
								state.racket_length, state.racket_width);
		if (intersection === null) {
			intersect_pos = state.player2_pos;

			intersection = this.intersectionRectangleBall(state, state.width - state.racket_shift - state.racket_width,
								state.player2_pos, state.racket_length, state.racket_width);
			if (intersection === null) {

				for (const obstacle of state.obstacles) {
					intersection = this.intersectionRectangleBall(state, obstacle.pos_x - obstacle.width / 2,
										obstacle.pos_y, obstacle.length, obstacle.width);

					if (intersection !== null) {
						intersect_pos = obstacle.pos_y;
						intersect_length = obstacle.length;
						break ;
					}
				}

				if (intersection === null) {
					return ;
				}
			}
		}

		// Increments speed on gamemode
		if (state.mode_speedup) {
			state.ball_speed += Math.floor(state.ball_initial_speed / 10);
		}

		// Shrink ball size on gamemode
		if (state.mode_shrink && state.ball_radius > min_ball_radius) {
			state.ball_radius -= state.ball_initial_radius / 10;
		}

		// Calcule la position relative de la balle par rapport à l'objet intersecte
		const relativePos = (state.ball_pos_y - intersect_pos) / intersect_length;


		// Calcule le ratio en fonction de la position relative
		const ratio = relativePos * 50;
		// Limite la valeur du ratio entre -50 et 50
		const clampedRatio = Math.max(-50, Math.min(50, ratio));

		// Modifie la direction de la balle en fonction du ratio
		state.ball_dir_y = state.ball_speed * (clampedRatio / 100);

		// Facteur de vitesse entre 1 et 2 en fonction du ratio
		const speedFactor = 1 + (Math.abs(clampedRatio) / 100);
		state.ball_dir_y *= speedFactor;

		// Repositionner la balle pour bon renvoi.
		const distance_x = Math.abs(intersection.x - state.ball_pos_x);

		if (state.ball_dir_x < 0) { // vers la gauche
			state.ball_dir_x = state.ball_speed;
			state.ball_pos_x -= distance_x;
		} else { // vers la droite
			state.ball_dir_x = -state.ball_speed;
			state.ball_pos_x += distance_x;
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

		state.obstacles.forEach((obstacle) => {
			obstacle.pos_x = obstacle.initial_pos_x;
			obstacle.pos_y = obstacle.initial_pos_y;
		});

		state.ball_pos_x = state.width / 2;
		state.ball_pos_y = state.height / 2;

		if (state.mode_shrink) {
			state.ball_radius = max_ball_radius;
			state.ball_initial_radius = max_ball_radius;
		}
		if (state.mode_chaos) {
			state.ball_speed = this.getRandomCapped(min_ball_speed, max_ball_speed);
			state.racket_speed = this.getRandomCapped(min_racket_speed, max_racket_speed);
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

		if (dto.user_id === room.player1_id) {
			room.state.player1_dir = newDir;
		} else {
			room.state.player2_dir = newDir;
		}
	}

	getRandomDirection(ballSpeed: number): [number, number] {
		let angle: number;
		if (Math.random() < 0.5) {
			// Si c'est le joueur de gauche qui effectue le service
			angle = (Math.random() * 50 - 25) * Math.PI / 180; // angle entre -25 et 25 degrés converti en radians
		} else {
			// Sinon, c'est le joueur de droite qui effectue le service
			angle = (Math.random() * 50 + 155) * Math.PI / 180; // angle entre 155 et 205 degrés converti en radians
		}

		// Calcule les composantes x et y de la direction en fonction de l'angle
		let x = ballSpeed * (Math.cos(angle) < 0 ? -1 : 1);
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

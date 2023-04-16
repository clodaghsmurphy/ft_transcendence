import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { GameCreateDto, GameKeyDto } from "./dto";
import { GameKeyEvent, GameObstacle, GameRoom, KeyAction, KeyType, defaultBall, defaultState, max_ball_radius, max_ball_speed, max_racket_length, max_racket_speed, min_ball_radius, min_ball_speed, min_racket_length, min_racket_speed } from "./types/game.types";
import { GameState , GameBall} from "./types/game.types";
import { Namespace } from 'socket.io';
import { use } from "passport";
import { getNextRatings } from "./rating";
import { cursorTo } from "readline";

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
		room.state = {...dto.state};
		this.initState(room.state);

		this.activeGames.set(game.id, room);
		return game;
	}

	async remove(id: number) {
		await this.checkGame(id);

		const game = await this.updateStats(id);

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

	async updateStats(id: number) {
		const gameRoom: GameRoom = this.activeGames.get(id);

		const player1_win: number = gameRoom.state.player1_goals === gameRoom.state.winning_goals ? 1 : 0;
		const player2_win: number = 1 - player1_win;

		const player1 = await this.prisma.user.findUnique({where: {id: gameRoom.player1_id}});
		const player2 = await this.prisma.user.findUnique({where: {id: gameRoom.player2_id}});

		const player1_past_stats = await this.prisma.stats.findUnique({where: {userId: player1.id}});
		const player2_past_stats = await this.prisma.stats.findUnique({where: {userId: player2.id}});

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
				rating: next_player1_rating
			}
		});

		await this.prisma.stats.update({
			where: {id: player2_past_stats.id},
			data: {
				wins: player2_past_stats.wins + player2_win,
				total_games: player2_past_stats.total_games,
				points: player2_past_stats.points + gameRoom.state.player2_goals,
				lvl: player2_past_stats.lvl + player2_win,
				rating: next_player2_rating
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
		}, 100);
	}

	gameLoop(state: GameState) {
		if (state.current_pause > 0) {
			--state.current_pause;
			return ;
		}

		this.movePaddles(state);
		this.moveObstacles(state);

		let ball: GameBall = {...defaultBall};

		ball.x = state.ball_pos_x;
		ball.y = state.ball_pos_y;
		ball.dir_x = state.ball_dir_x;
		ball.dir_y = state.ball_dir_y;
		ball.radius = state.ball_radius / 2;

		// console.log("Nouvelle appelle");

		this.checkBallCollision(state, ball, 0);

		

		this.checkGoal(state);

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

	intersectionSegment(a1x: number, a1y: number, a2x: number, a2y: number, b1x: number, b1y: number, b2x: number, b2y: number) : {dist_x:number, dist_y:number, dist:number} | null {
		var den = (b2y - b1y) * (a2x - a1x) - (b2x - b1x) * (a2y - a1y);
		var num1 = (b2x - b1x) * (a1y - b1y) - (b2y - b1y) * (a1x - b1x);
		var num2 = (a2x - a1x) * (a1y - b1y) - (a2y - a1y) * (a1x - b1x);

		if (den === 0) {
			// Les segments sont parallèles
			return null;
		}

		var r = num1 / den;
		var s = num2 / den;

		if (r >= 0 && r <= 1 && s >= 0 && s <= 1) {
			// Les segments se croisent
			var intersectionX = a1x + r * (a2x - a1x);
			var intersectionY = a1y + r * (a2y - a1y);
			var distanceX = intersectionX - a1x; // Distance en x entre intersection et a1x
			var distanceY = intersectionY - a1y; // Distance en y entre intersection et a1y
			return { dist_x: distanceX, dist_y: distanceY, dist: Math.sqrt(Math.pow(intersectionX - a1x, 2) + Math.pow(intersectionY - a1y, 2)) };

		}
		return null;
	}

	getCollisionPoint(x1: number, y1: number, width1: number, height1: number, x2: number, y2: number, width2: number, height2: number, droite: boolean, haut: boolean): any | null {
		const right1 = x1 + width1;
		const bottom1 = y1 - height1;
		const right2 = x2 + width2;
		const bottom2 = y2 - height2;
	  

		// Check for collision
		if (x1 < right2 && right1 > x2 && y1 < bottom2 && bottom1 > y2) {
			// Rectangles collide
			if (haut && droite) // envoie bas gauche
				return ({ x: x2, y: y2 });
			else if (!haut && droite) // envoie haut gauche
				return ({ x: x2, y: y2 + height2});
			else if (haut && !droite) // envoie bas droit
				return ({ x: x2 + width2, y: y2 });
			else // envoie haut droit
				return ({ x: x2 + width2, y: y2 + width2});
		}
		return null;
	}

	intersectionRectangleBall(ball: GameBall, rectangle_x : number, player_pos: number, length: number, width: number) : {dist_x:number, dist_y:number, dist:number} | null
	{
		const half_length = length / 2;
		const gauche = ball.dir_x < 0;
		const haut = ball.dir_y < 0;

		const rectangle = {
			haut_gauche : {
				x : rectangle_x,
				y : player_pos + half_length,
			},
			haut_droit : {
				x : rectangle_x + width,
				y : player_pos + half_length,
			},
			bas_gauche : {
				x : rectangle_x,
				y : player_pos - half_length,
			},
			bas_droit : {
				x : rectangle_x + width,
				y : player_pos - half_length,
			},
		};

		const next_ball_x = ball.x + ball.dir_x;
		const next_ball_y = ball.y + ball.dir_y;

		const ball_rectangle = {
			bas_gauche : {
				x : next_ball_x - ball.radius,
				y : next_ball_y - ball.radius,
				x_current : ball.x - ball.radius,
				y_current : ball.y - ball.radius,
			},
			bas_droit : {
				x : next_ball_x + ball.radius,
				y : next_ball_y - ball.radius,
				x_current : ball.x + ball.radius,
				y_current : ball.y - ball.radius,
			},
			haut_droit: {
				x : next_ball_x + ball.radius,
				y : next_ball_y + ball.radius,
				x_current : ball.x + ball.radius,
				y_current : ball.y + ball.radius,
			},
			haut_gauche: {
				x : next_ball_x - ball.radius,
				y : next_ball_y + ball.radius,
				x_current : ball.x - ball.radius,
				y_current : ball.y + ball.radius,
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
			hauteur_rect = {x1: rectangle.haut_droit.x, y1: rectangle.haut_droit.y, x2: rectangle.bas_droit.x, y2: rectangle.bas_droit.y, largeur: false};
		}
		else
		{
			hauteur_ball = {x1: ball_rectangle.bas_droit.x_current, y1: ball_rectangle.bas_droit.y_current, x2: ball_rectangle.haut_droit.x_current, y2: ball_rectangle.haut_droit.y_current, largeur: false};
			hauteur_rect = {x1: rectangle.bas_gauche.x, y1: rectangle.bas_gauche.y, x2: rectangle.haut_gauche.x, y2: rectangle.haut_gauche.y, largeur: false};
		} 

		// Je suis cense avoir 4 coordonnes dans chaque liste. 
		// Les coordonnes des extremites sur les cotes droite ou gauche a tester donc 2
		// Et pareillement avec le haut ou le bas donc 2

		var intersection : {dist_x:number, dist_y:number, dist:number} | null = null;
		var intersection_test : {dist_x:number, dist_y:number, dist:number} | null ;

		for (let i = largeur_ball.x1; i <= largeur_ball.x2; i++) {
			intersection_test = this.intersectionSegment(i, largeur_ball.y1, i + ball.dir_x, largeur_ball.y1 + ball.dir_y, largeur_rect.x1, largeur_rect.y1, largeur_rect.x2, largeur_rect.y2);
			if (intersection_test)
			{
				if (intersection === null || intersection.dist > intersection_test.dist)
					intersection = intersection_test;
			}
		}
		
		if (intersection)
			console.log("Find intersection ")

		for (let i = hauteur_ball.y1; i <= hauteur_ball.y2; i++) {
			intersection_test = this.intersectionSegment(hauteur_ball.x1, i, hauteur_ball.x1 + ball.dir_x, i + ball.dir_y, hauteur_ball.x1, hauteur_ball.y1, hauteur_ball.x2, hauteur_ball.y2);
			if (intersection_test)
			{
				if (intersection === null || intersection.dist > intersection_test.dist)
					intersection = intersection_test;
			}
		}
		console.log(rectangle);
		console.log(ball_rectangle);
		console.log("Intersection : ", intersection, largeur_ball, largeur_rect, hauteur_ball, hauteur_rect);

		if (intersection)
			if (intersection.dist === 0)
				return null;

		return intersection;

	}

	getDistance(x1: number, y1: number, x2: number, y2: number): { deltaX: number, deltaY: number } {
		const deltaX = Math.abs(x2 - x1);
		const deltaY = Math.abs(y2 - y1);
		return { deltaX, deltaY };
	}

	callibrage_ball_after_impact(ball: GameBall, state: GameState, vertical_hit: boolean, hit: {dist_x:number, dist_y:number, dist:number}) {
		 // mettre a jour la position de la balle par rapport a hit
		const dist_du_hit_x = hit.dist_x * Math.sign(state.ball_dir_x) * -1;
		const dist_du_hit_y = hit.dist_y * Math.sign(state.ball_dir_y) * -1;
		const droite = state.ball_dir_x > 0;
		const haut = state.ball_dir_y > 0;
		ball.dir_x -= dist_du_hit_x;
		ball.dir_y -= dist_du_hit_y;
		if (vertical_hit)
		{
			ball.x += dist_du_hit_x + (ball.radius + 1) * Math.sign(state.ball_dir_x) * -1;
			ball.y += dist_du_hit_y;
			state.ball_pos_x += 2 * dist_du_hit_x;
			state.ball_dir_x = state.ball_speed * Math.sign(state.ball_dir_x) * -1;
		}
		// else // pas encore utilise
		// {
		// 	const distance_y = Math.abs(hit.y - state.ball_pos_y);
		// 	if (haut)
		// 		state.ball_pos_y += 2 * distance_y;
		// 	else
		// 		state.ball_pos_y -= 2 * distance_y;
		// 	state.ball_dir_y *= -1;
		// }
	}

	checkBallCollision(state: GameState, ball: GameBall, recursivite: number) {
		if (recursivite > 50) {
			state.ball_pos_x += state.ball_dir_x;
			state.ball_pos_y += state.ball_dir_y;
			return ;
		}

		const next_ball_y = ball.y + ball.dir_y;
		const next_ball_x = ball.x + ball.dir_x;
		
		// Vérifie si la balle a atteint un bord de l'ecran et la fait rebondir si c'est le cas
		if (next_ball_y - ball.radius <= 0 && ball.dir_y < 0) {
			ball.y = ball.radius + 1;
			ball.dir_y *= -1;
			return (this.checkBallCollision(state, ball, recursivite + 1));
		}
		if (next_ball_y + ball.radius >= state.height && ball.dir_y > 0) {
			ball.y = state.height - ball.radius -1;
			ball.dir_y *= -1;
			return (this.checkBallCollision(state, ball, recursivite + 1));
		}

		let intersect_pos = state.player1_pos;
		let intersect_length = state.racket_length;
		console.log("check player1");
		let intersection = this.intersectionRectangleBall(ball, state.racket_shift, state.player1_pos,
								state.racket_length, state.racket_width);
		if (intersection === null) {
			intersect_pos = state.player2_pos;
			console.log("check player2");
			intersection = this.intersectionRectangleBall(ball, state.width - state.racket_shift - state.racket_width,
								state.player2_pos, state.racket_length, state.racket_width);
		}
		if (intersection === null) {
			for (const obstacle of state.obstacles) {
					intersect_pos = obstacle.pos_y;
					intersect_length = obstacle.length;
					console.log("check obstacle");
					intersection = this.intersectionRectangleBall(ball, obstacle.pos_x - obstacle.width / 2,
									obstacle.pos_y, obstacle.length, obstacle.width);
			}	
		}
		if (intersection === null) { // no hit || (intersection && intersection.dist == 0)
			// avancer ball 
			state.ball_pos_x += state.ball_dir_x;
			state.ball_pos_y += state.ball_dir_y;
			return ;
		}

		// console.log("hit : ", intersection , state);

		// Increments speed on gamemode
		if (state.mode_speedup) {
			const speed = Math.floor(state.ball_initial_speed / 10);
			state.ball_speed += speed;
			ball.dir_x += Math.sign(ball.dir_x) * speed;
		}

		// Shrink ball size on gamemode
		if (state.mode_shrink && state.ball_radius > min_ball_radius) {
			state.ball_radius -= state.ball_initial_radius / 10;
		}

		// Calcule la position relative de la balle par rapport à l'objet intersecte
		const relativePos = (ball.y - intersect_pos) / intersect_length;


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


		this.callibrage_ball_after_impact(ball, state, true, intersection)

		return (this.checkBallCollision(state, ball, recursivite + 1));

	}

	checkGoal(state: GameState) {
		let goal: boolean = false;

		// Vérifie si la balle est passée la raquette de joueur1 et incrémente les points de joueur2 si c'est le cas
		if (state.ball_pos_x - state.ball_radius < 0) {
			state.player2_goals++;
			goal = true;
		}

		// Vérifie si la balle est passée la raquette de joueur2 et incrémente les points de joueur1 si c'est le cas
		if (state.ball_pos_x + state.ball_radius > state.width) {
			state.player1_goals++;
			goal = true;
		}

		// Reset the game state
		if (goal) {
			const player1 = state.player1_pos;
			const player2 = state.player2_pos;
			this.initState(state);
			state.player1_pos = player1;
			state.player2_pos = player2;
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

		room.state.player1_dir = newDir;
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

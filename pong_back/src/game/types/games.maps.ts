import { GameObstacle } from "./game.types";

export enum GameMap {
	Classic = "classic",
	Pendulum = "pendulum",
	DoubleTrouble = "double trouble",
	ParallelPeril = "parallel peril",
	MazeMadness = "maze madness",
};


export const classic_map: GameObstacle[] = [];

export const pendulum_map: GameObstacle[] = [{
	pos_x: 300,
	pos_y: 60,
	initial_pos_x: 300,
	initial_pos_y: 60,
	width: 10,
	length: 120,
	dir_x: 0,
	dir_y: 5,
}];

export const parallel_peril_map: GameObstacle[] = [{
	pos_x: 200,
	pos_y: 60,
	initial_pos_x: 200,
	initial_pos_y: 60,
	width: 10,
	length: 120,
	dir_x: 0,
	dir_y: 5,
},{
	pos_x: 400,
	pos_y: 340,
	initial_pos_x: 400,
	initial_pos_y: 340,
	width: 10,
	length: 120,
	dir_x: 0,
	dir_y: -5,
}];

export const double_trouble_map: GameObstacle[] = [{
	pos_x: 300,
	pos_y: 60,
	initial_pos_x: 300,
	initial_pos_y: 60,
	width: 10,
	length: 120,
	dir_x: 0,
	dir_y: 0,
},{
	pos_x: 300,
	pos_y: 340,
	initial_pos_x: 300,
	initial_pos_y: 340,
	width: 10,
	length: 120,
	dir_x: 0,
	dir_y: 0,
}];

export const maze_madness_map: GameObstacle[] = [{
	pos_x: 300,
	pos_y: 60,
	initial_pos_x: 300,
	initial_pos_y: 60,
	width: 20,
	length: 120,
	dir_x: 0,
	dir_y: 0,
},{
	pos_x: 300,
	pos_y: 340,
	initial_pos_x: 300,
	initial_pos_y: 340,
	width: 20,
	length: 120,
	dir_x: 0,
	dir_y: 0,
},{
	pos_x: 170,
	pos_y: 120,
	initial_pos_x: 170,
	initial_pos_y: 120,
	width: 20,
	length: 80,
	dir_x: 0,
	dir_y: 0,
},{
	pos_x: 170,
	pos_y: 280,
	initial_pos_x: 170,
	initial_pos_y: 280,
	width: 20,
	length: 80,
	dir_x: 0,
	dir_y: 0,
},{
	pos_x: 430,
	pos_y: 120,
	initial_pos_x: 430,
	initial_pos_y: 120,
	width: 20,
	length: 80,
	dir_x: 0,
	dir_y: 0,
},{
	pos_x: 430,
	pos_y: 280,
	initial_pos_x: 430,
	initial_pos_y: 280,
	width: 20,
	length: 80,
	dir_x: 0,
	dir_y: 0,
}];


export const game_maps: Map<GameMap, GameObstacle[]> = new Map([
	[GameMap.Classic, classic_map],
	[GameMap.DoubleTrouble, double_trouble_map],
	[GameMap.MazeMadness, maze_madness_map],
	[GameMap.ParallelPeril, parallel_peril_map],
	[GameMap.Pendulum, pendulum_map],
]);

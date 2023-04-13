import { GameObstacle } from "./game.types";

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
	pos_x: 230,
	pos_y: 110,
	initial_pos_x: 230,
	initial_pos_y: 110,
	width: 120,
	length: 20,
	dir_x: 0,
	dir_y: 0,
},{
	pos_x: 370,
	pos_y: 290,
	initial_pos_x: 370,
	initial_pos_y: 290,
	width: 120,
	length: 20,
	dir_x: 0,
	dir_y: 0,
},{
	pos_x: 170,
	pos_y: 140,
	initial_pos_x: 170,
	initial_pos_y: 140,
	width: 20,
	length: 80,
	dir_x: 0,
	dir_y: 0,
},{
	pos_x: 430,
	pos_y: 260,
	initial_pos_x: 430,
	initial_pos_y: 260,
	width: 20,
	length: 80,
	dir_x: 0,
	dir_y: 0,
}];

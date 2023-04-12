export class GameState {
	ongoing: boolean;

	width: number;
	height: number;

	racket_speed: number;
	racket_length: number;
	racket_width: number;
	racket_shift: number;

	player1_pos: number;
	player2_pos: number;

	player1_dir: number;
	player2_dir: number;

	player1_goals: number;
	player2_goals: number;

	ball_pos_x: number;
	ball_pos_y: number;

	ball_dir_x: number;
	ball_dir_y: number;

	ball_radius: number;
	ball_initial_radius: number;

	ball_speed: number;
	ball_initial_speed: number;

	// Duration on pause after a goal in frames
	pause_frames: number;
	current_pause: number;

	// Gamemodes
	mode_speedup: boolean;
	mode_shrink: boolean;
	mode_chaos: boolean;
}

export const defaultState: GameState = {
	ongoing: true,

	// TODO: Figure out default screen size
	width: 400,
	height: 400,

	// TODO: Figure out racket length and speed
	racket_speed: 10,
	racket_length: 80, // hauteur
	racket_width: 10, // largeur
	racket_shift: 20, // decalage

	player1_pos: 200,
	player2_pos: 200,

	player1_dir: 0,
	player2_dir: 0,

	player1_goals: 0,
	player2_goals: 0,

	ball_pos_x: 200,
	ball_pos_y: 200,

	ball_dir_x: 0,
	ball_dir_y: 0,

	ball_radius: 20,
	ball_initial_radius: 20,

	ball_speed: 10,
	ball_initial_speed: 10,

	pause_frames: 15,
	current_pause: 0,

	mode_speedup: true,
	mode_shrink: true,
	mode_chaos: true,
};

export class GameRoom {
	id: number;

	player1_id: number;
	player2_id: number;

	state: GameState;

}

export enum KeyType {
	Up = "Up",
	Down = "Down",
};

export enum KeyAction {
	Press = "Press",
	Release = "Release",
};

export class GameKeyEvent {
	key: KeyType;
	action: KeyAction;
}

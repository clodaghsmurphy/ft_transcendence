export class GameState {
	ongoing: boolean;

	width: number;
	height: number;

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
}

export const defaultState: GameState = {
	ongoing: true,

	// TODO: Figure out default screen size
	width: 400,
	height: 400,

	player1_pos: 200,
	player2_pos: 200,

	player1_dir: 0,
	player2_dir: 0,

	player1_goals: 0,
	player2_goals: 0,

	ball_pos_x: 200,
	ball_pos_y: 200,

	ball_dir_x: 0,
	ball_dir_y: 0
};

export class GameRoom {
	id: number;

	player1_id: number;
	player2_id: number;

	state: GameState;

	// TMP TEST
	rounds: number;
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

export class GameState {
	ongoing: boolean;
}

export class GameRoom {
	id: number;

	player1_id: number;
	player2_id: number;

	state: GameState;

	// TMP TEST
	rounds: number;
}

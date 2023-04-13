import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, Min, Max, IsBoolean } from "class-validator";
import { GameKeyEvent, max_ball_radius, max_ball_speed, max_racket_length, max_racket_speed, max_winning_goals, min_ball_radius, min_ball_speed, min_racket_length, min_racket_speed, min_winning_goals } from "../types/game.types";
import { GameMap } from "../types/games.maps";

export class GameCreateDto {
	// Temporary measure before matchmaking/invites are implemented
	@IsNotEmpty()
	@IsNumber()
	target_id: number;

	@IsOptional()
	@IsNotEmpty()
	@IsNumber()
	@Min(min_racket_length)
	@Max(max_racket_length)
	racket_length: number;

	@IsOptional()
	@IsNotEmpty()
	@IsNumber()
	@Min(min_racket_speed)
	@Max(max_racket_speed)
	racket_speed: number;

	@IsOptional()
	@IsNotEmpty()
	@IsNumber()
	@Min(min_ball_radius)
	@Max(max_ball_radius)
	ball_initial_radius: number;

	@IsOptional()
	@IsNotEmpty()
	@IsNumber()
	@Min(min_ball_speed)
	@Max(max_ball_speed)
	ball_initial_speed: number;

	@IsOptional()
	@IsNotEmpty()
	@IsNumber()
	@Min(min_winning_goals)
	@Max(max_winning_goals)
	winning_goals: number;

	@IsOptional()
	@IsNotEmpty()
	@IsBoolean()
	mode_speedup: boolean;

	@IsOptional()
	@IsNotEmpty()
	@IsBoolean()
	mode_shrink: boolean;

	@IsOptional()
	@IsNotEmpty()
	@IsBoolean()
	mode_chaos: boolean;

	@IsOptional()
	@IsNotEmpty()
	@IsEnum(GameMap)
	game_map: GameMap;
}

export class GameParams {
	@IsNumberString()
	@IsNotEmpty()
	id: string;
}

export class GameRemoveDto {
	// Temporary, games should be removed automatically in the future
	@IsNotEmpty()
	@IsNumber()
	id: number;
}

// Temporary as well
export class GameJoinDto extends GameRemoveDto {
	@IsNotEmpty()
	@IsNumber()
	user_id: number;
}

export class GameKeyDto extends GameJoinDto {
	@IsNotEmpty()
	@Type(() => GameKeyEvent)
	keyEvent: GameKeyEvent;
}

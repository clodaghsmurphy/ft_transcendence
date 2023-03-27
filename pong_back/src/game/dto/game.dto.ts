import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class GameCreateDto {
	@IsNotEmpty()
	@IsNumber()
	room_id: string;

	@IsOptional()
	@IsNumber({}, {each: true})
	player_ids: number[];

	@IsOptional()
	@IsNumber({}, {each: true})
	spectator_ids: number[];

	@IsNotEmpty()
	@IsNumber({}, {each: true})
	ball_coord: number[];

	@IsNotEmpty()
	@IsNumber({}, {each: true})
	ball_direction: number[];

	@IsNotEmpty()
	@IsNumber({}, {each: true})
	players_y: number[];
}

export class GameJoinDto {
	@IsNumber()
	@IsNotEmpty()
	user_id: number;
}

export class GameLeaveDto {
	@IsNumber()
	@IsNotEmpty()
	user_id: number;
}

export class MovementDto {
	@IsNumber()
	@IsNotEmpty()
	uid: number;

	@IsString()
	@IsNotEmpty()
	move: string;
}


import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, ValidateNested } from "class-validator";
import { GameKeyEvent } from "../types/game.types";

export class GameCreateDto {
	// Temporary measure before matchmaking/invites are implemented
	@IsNotEmpty()
	@IsNumber()
	target_id: number;
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

import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class UserCreateDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	avatar: string;

	@IsNotEmpty()
	@IsNumber()
	id: number;
}

export class UserUpdateDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	avatar: string;

	@IsNotEmpty()
	@IsNumber()
	id: number;

	@IsOptional()
	@IsArray()
	blocked_users: string[];

	@IsOptional()
	@IsArray()
	friend_users: string[];

	@IsOptional()
	@IsArray()
	channels: string[];

	@IsOptional()
	@IsBoolean()
	connected: boolean;

	@IsOptional()
	@IsBoolean()
	in_game: boolean;

	@IsOptional()
	@IsNumber()
	game_id: number;
}

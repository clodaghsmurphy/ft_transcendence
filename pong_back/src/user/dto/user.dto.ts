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
	blocked_users: number[];

	@IsOptional()
	@IsArray()
	friend_users: number[];

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

	@IsOptional()
	@IsString()
	otp_base32: string;

	@IsOptional()
	@IsString()
	otp_auth_url: string
}

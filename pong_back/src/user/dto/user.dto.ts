import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator"

export class UserCreateDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsOptional()
	@IsNotEmpty()
	avatar: string;

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	avatar_path: string;

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

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	avatar_path: string;

	@IsNotEmpty()
	@IsNumber()
	id: number;

	@IsOptional()
	@IsNumber({}, {each: true})
	blocked_users: number[];

	@IsOptional()
	@IsNumber({}, {each: true})
	friend_users: number[];

	@IsOptional()
	@IsArray()
	@IsString({each: true})
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

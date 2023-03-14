import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ChannelCreateDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	username: string;
}

export class ChannelJoinDto extends ChannelCreateDto {
}

export class MessageCreateDto {
	@IsNumber()
	@IsNotEmpty()
	uid: number;

	@IsString()
	@IsNotEmpty()
	text: string;

	@IsString()
	@IsNotEmpty()
	name: string;
}
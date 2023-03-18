import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ChannelCreateDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsNumber()
	@IsNotEmpty()
	user_id: number;
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

	@IsNumber()
	@IsNotEmpty()
	sender_id: number;

	@IsString()
	@IsNotEmpty()
	sender_name: string;
}

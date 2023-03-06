import { IsNotEmpty, IsString } from "class-validator";

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

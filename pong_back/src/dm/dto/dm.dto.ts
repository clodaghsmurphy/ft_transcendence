import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DmGetDto {
	@IsNumber()
	@IsNotEmpty()
	user1: number;

	@IsNumber()
	@IsNotEmpty()
	user2: number;
}

export class DmJoinDto extends DmGetDto {}

export class DmCreateDto {
	@IsNumber()
	@IsNotEmpty()
	sender_id: number;

	@IsNumber()
	@IsNotEmpty()
	receiver_id: number;

	@IsString()
	@IsNotEmpty()
	text: string;
}

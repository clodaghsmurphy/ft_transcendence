import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DmGetDto {
	@IsNumber()
	@IsNotEmpty()
	sender_id: number;

	@IsNumber()
	@IsNotEmpty()
	receiver_id: number;
}

export class DmJoinDto extends DmGetDto {}

export class DmCreateDto extends DmGetDto {
	@IsString()
	@IsNotEmpty()
	text: string;
}

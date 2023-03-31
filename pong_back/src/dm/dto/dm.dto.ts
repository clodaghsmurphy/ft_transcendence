import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DmGetDto {
	@IsNumber()
	@IsNotEmpty()
	receiver_id: number;

	@IsNumber()
	@IsNotEmpty()
	sender_id: number;
}

export class DmJoinDto extends DmGetDto {
}

export class DmCreateDto extends DmJoinDto {
	@IsString()
	@IsNotEmpty()
	text: string;
}

import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DmJoinDto {
	@IsNumber()
	@IsNotEmpty()
	receiver_id: number;
}

export class DmCreateDto extends DmJoinDto {
	@IsString()
	@IsNotEmpty()
	text: string;
}

import { IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator";

export class DmJoinDto {
	@IsNumber()
	@IsNotEmpty()
	receiver_id: number;
}

export class DmLeaveDto extends DmJoinDto {}

export class DmCreateDto extends DmJoinDto {
	@IsString()
	@IsNotEmpty()
	text: string;
}

export class DmParams {
	@IsNumberString()
	@IsNotEmpty()
	id: string;
}

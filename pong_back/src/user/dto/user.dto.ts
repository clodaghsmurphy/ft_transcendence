import { IsNotEmpty, IsString } from "class-validator"

export class UserDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	avatar: string;
}

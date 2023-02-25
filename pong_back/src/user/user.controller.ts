import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { User } from "@prisma/client";
import { UserDto } from "./dto";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@Get('info')
	getAllUsers() {
		return this.userService.getAllUsers();
	}

	@Get('info/:name')
	findUser(@Param() params) {
		return this.userService.findUser(params.name);
	}

	@Post('create')
	createUser(@Body() dto: UserDto) {
		return this.userService.createUser(dto);
	}
}

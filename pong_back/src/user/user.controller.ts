import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserCreateDto, UserUpdateDto } from "./dto";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@Get('info')
	getAllUsers() {
		return this.userService.getAll();
	}

	@Get('info/:name')
	getUser(@Param() params) {
		return this.userService.get(params.name);
	}

	@Get('info/:name/:attribute')
	getUserInfo(@Param() params) {
		return this.userService.getInfo(params.name, params.attribute);
	}

	@Post('create')
	createUser(@Body() dto: UserCreateDto) {
		return this.userService.create(dto);
	}

	@Post('update')
	updateUser(@Body() dto: UserUpdateDto) {
		return this.userService.update(dto);
	}
}

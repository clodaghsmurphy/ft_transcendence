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

	@Get('info/:id')
	getUser(@Param() params) {
		return this.userService.get(parseInt(params.id));
	}

	@Get('info/:id/:attribute')
	getUserInfo(@Param() params) {
		return this.userService.getInfo(parseInt(params.id), params.attribute);
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

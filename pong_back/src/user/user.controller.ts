import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
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
		this.checkId(params.id);
		return this.userService.get(parseInt(params.id));
	}

	@Get('info/:id/:attribute')
	getUserInfo(@Param() params) {
		this.checkId(params.id);
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

	checkId(id: string) {
		if (Number.isNaN(parseInt(id))) {
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `'${id}' is not a valid number`,
			}, HttpStatus.BAD_REQUEST);
		}
	}
}

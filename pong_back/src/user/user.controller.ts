import { Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	// These will route /user/info
	@Get('info')
	info() {
		return this.userService.info();
	}
}

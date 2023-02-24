import { Controller, Get } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	// This will route /user/info
	@Get('info')
	info() {
		return this.userService.info();
	}
}

import { Body, Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/utils/JwtGuard";
import { DmService } from "./dm.service";
import { DmParams } from "./dto";

@Controller('dm')
export class DmController {
	constructor (private dmService: DmService) {}

	@UseGuards(JwtAuthGuard)
	@Get()
	getUsers(@Req() request) {
		return this.dmService.getUsers(request.user.id);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	getDms(@Req() request, @Param() params: DmParams) {
		const data = {
			sender_id: request.user.id,
			receiver_id: parseInt(params.id),
		};
		return this.dmService.get(data);
	}
}

import { Body, Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/utils/JwtGuard";
import { DmService } from "./dm.service";

@Controller('dm')
export class DmController {
	constructor (private dmService: DmService) {}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	getDms(@Req() request, @Param() params) {
		const data = {
			sender_id: request.user.id,
			receiver_id: parseInt(params.id),
		};
		return this.dmService.get(data);
	}
}

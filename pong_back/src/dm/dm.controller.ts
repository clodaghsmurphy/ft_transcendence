import { Body, Controller, Get, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/utils/JwtGuard";
import { DmService } from "./dm.service";
import { DmGetDto } from "./dto";

@Controller('dm')
export class DmController {
	constructor (private dmService: DmService) {}

	@UseGuards(JwtAuthGuard)
	@Get()
	getDms(@Req() request, @Body() dto: DmGetDto) {
		const data: any = dto;
		data.sender_id = request.user.id;
		return this.dmService.get(data);
	}
}

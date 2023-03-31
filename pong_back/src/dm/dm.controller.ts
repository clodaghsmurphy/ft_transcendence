import { Body, Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/utils/JwtGuard";
import { DmService } from "./dm.service";
import { DmGetDto } from "./dto";

@Controller('dm')
export class DmController {
	constructor (private dmService: DmService) {}

	@UseGuards(JwtAuthGuard)
	@Get()
	getDms(@Body() dto: DmGetDto) {
		return this.dmService.get(dto);
	}
}

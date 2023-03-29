import { Body, Controller, Get } from "@nestjs/common";
import { DmService } from "./dm.service";
import { DmGetDto } from "./dto";

@Controller('dm')
export class DmController {
	constructor (private dmService: DmService) {}

	@Get()
	getDms(@Body() dto: DmGetDto) {
		return this.dmService.get(dto);
	}
}

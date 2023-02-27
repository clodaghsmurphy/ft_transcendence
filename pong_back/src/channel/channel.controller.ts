import { Controller, Get, Param } from "@nestjs/common";
import { ChannelService } from "./channel.service";

@Controller('channel')
export class ChannelController {
	constructor (private channelService: ChannelService) {}

	@Get('info')
	getAllChannels() {
		return this.channelService.getAllChannels();
	}

	@Get('info/:name')
	getChannel(@Param() params) {
		return this.channelService.getChannel(params.name);
	}
}

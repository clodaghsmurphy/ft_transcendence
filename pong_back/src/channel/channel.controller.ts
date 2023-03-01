import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ChannelService } from "./channel.service";
import { ChannelCreateDto } from "./dto";

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

	@Post('create')
	createChannel(@Body() dto: ChannelCreateDto) {
		return this.channelService.createChannel(dto);
	}
}

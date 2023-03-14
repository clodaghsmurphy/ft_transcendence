import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ChannelService } from "./channel.service";
import { ChannelCreateDto, ChannelJoinDto } from "./dto";

@Controller('channel')
export class ChannelController {
	constructor (private channelService: ChannelService) {}

	@Get('info')
	getAllChannels() {
		return this.channelService.getAll();
	}

	@Get('info/:name')
	getChannel(@Param() params) {
		return this.channelService.get(params.name);
	}

	@Post('create')
	createChannel(@Body() dto: ChannelCreateDto) {
		return this.channelService.create(dto);
	}

	@Post('join')
	joinChannel(@Body() dto: ChannelJoinDto) {
		return this.channelService.join(dto);
	}
}

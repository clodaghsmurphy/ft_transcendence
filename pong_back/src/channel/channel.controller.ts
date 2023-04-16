import { Body, Controller, Get, Param, Post,  Request, UseGuards } from "@nestjs/common";
import { ChannelService } from "./channel.service";
import { ChannelCreateDto, ChannelJoinDto, ChannelLeaveDto, ChannelParams } from "./dto";
import { JwtAuthGuard } from "src/auth/utils/JwtGuard";

@Controller('channel')
export class ChannelController {
	constructor (private channelService: ChannelService) {}

	@Get('info')
	getAllChannels() {
		return this.channelService.getAll();
	}

	@Get('info/:name')
	getChannel(@Param() params: ChannelParams) {
		return this.channelService.get(params.name);
	}

	@Get('info/:name/:attribute')
	getChannelInfo(@Param() params: ChannelParams) {
		return this.channelService.getInfo(params.name, params.attribute);
	}

	@UseGuards(JwtAuthGuard)
	@Post('create')
	createChannel(@Request() request, @Body() dto: ChannelCreateDto) {
		let data: any = dto;
		data.owner_id = request.user.id;

		return this.channelService.create(data);
	}

	@UseGuards(JwtAuthGuard)
	@Post('join')
	joinChannel(@Request() request, @Body() dto: ChannelJoinDto) {
		let data: any = dto;
		data.user_id = request.user.id;

		return this.channelService.join(data);
	}

	@UseGuards(JwtAuthGuard)
	@Post('leave')
	leaveChannel(@Request() request, @Body() dto: ChannelLeaveDto) {
		let data: any = dto;
		data.user_id = request.user.id;

		return this.channelService.leave(data);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':name/messages')
	getAllMessages(@Request() request, @Param() params: ChannelParams) {
		return this.channelService.getAllMessages(request.user.id, params.name);
	}
}

import { HttpException, Logger, UseFilters, UsePipes, ValidationPipe } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Channel } from "@prisma/client";
import { Socket, Namespace } from 'socket.io';
import { BadRequestFilter } from "./channel.filters";
import { ChannelService } from "./channel.service";
import { ChannelCreateDto, ChannelJoinDto, ChannelKickDto, ChannelLeaveDto, MakeOpDto, MessageCreateDto, UserMuteDto } from "./dto";

@UseFilters(new BadRequestFilter())
@WebSocketGateway({namespace: 'channel'})
export class ChannelGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private logger = new Logger(ChannelGateway.name);

	@WebSocketServer() io: Namespace;

	constructor (private readonly channelService: ChannelService) {}

	afterInit() {
		this.logger.log('Websocket gateway initialized.');
	}

	handleConnection(client: Socket) {
		this.logger.log(`New client with id: ${client.id} connected.`);
		this.logger.log(`Number of connection: ${this.io.sockets.size}.`);
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Disconnected client with id: ${client.id}.`);
		this.logger.log(`Number of connection: ${this.io.sockets.size}.`);
	}

	@SubscribeMessage('join')
	async handleJoin(@MessageBody() dto: ChannelJoinDto, @ConnectedSocket() client: Socket) {
		if (client.rooms.has(dto.name))
			throw new WsException(`error: client has already joined room ${dto.name}`);

		try {
			await this.channelService.checkUserInChannel(dto.user_id, dto.name);
			client.join(dto.name);
			this.io.in(dto.name).emit('join', {name: dto.name, user: dto.user_id});
		} catch (e) {
			client.leave(dto.name);
			throw new WsException(e);
		}
	}

	@SubscribeMessage('leave')
	async handleLeave(@MessageBody() dto: ChannelLeaveDto, @ConnectedSocket() client: Socket) {
		this.checkUser(client, dto.name);

		try {
			await this.channelService.checkUserInChannel(dto.user_id, dto.name);
			this.io.in(dto.name).emit('leave', {name: dto.name, user: dto.user_id});
			client.leave(dto.name);
		} catch (e) {
			client.leave(dto.name);
			throw new WsException(e);
		}
	}

	@SubscribeMessage('kick')
	async handleKick(@MessageBody() dto: ChannelKickDto, @ConnectedSocket() client: Socket) {
		this.checkUser(client, dto.name);

		try {
			await this.channelService.checkOperator(dto.user_id, dto.name);
			await this.channelService.leave({user_id: dto.target_id, name: dto.name});

			this.io.in(dto.name).emit('kick', {name: dto.name, user_id: dto.user_id, target_id: dto.target_id});
		} catch (e) {
			throw new WsException(e);
		}
	}

	@SubscribeMessage('message')
	async handleMessage(@MessageBody() dto: MessageCreateDto, @ConnectedSocket() client: Socket) {
		this.checkUser(client, dto.name);
		try {
			const message = await this.channelService.postMessage(dto);
			this.io.in(dto.name).emit('message', message);
		} catch (e) {
			this.logger.log(e);
			throw new WsException(e);
		}
	}

	@SubscribeMessage('mute')
	async handleMute(@MessageBody() dto: UserMuteDto, @ConnectedSocket() client: Socket) {
		this.checkUser(client, dto.name);
		try {
			await this.channelService.checkOperator(dto.user_id, dto.name);
			await this.channelService.mute(dto);

			this.io.in(dto.name).emit('mute', {
				name: dto.name,
				user_id: dto.user_id,
				target_id: dto.target_id,
				mute_duration: dto.mute_duration,
			});
		} catch (e) {
			throw new WsException(e);
		}
	}

	@SubscribeMessage('makeop')
	async handleMakeOp(@MessageBody() dto: MakeOpDto, @ConnectedSocket() client: Socket) {
		this.checkUser(client, dto.name);
		try {
			await this.channelService.checkOperator(dto.user_id, dto.name);
			await this.channelService.makeOp(dto);

			this.io.in(dto.name).emit('makeop', {name: dto.name, user_id: dto.user_id, target_id: dto.target_id});
		} catch (e) {
			throw new WsException(e);
		}
	}

	checkUser(client: Socket, channel: string) {
		if (!client.rooms.has(channel))
			throw new WsException(`error: client hasnt joined room ${channel}`);
	}
}

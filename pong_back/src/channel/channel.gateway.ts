import { HttpException, Logger, UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Channel } from "@prisma/client";
import { Socket, Namespace } from 'socket.io';
import { BadRequestFilter } from "./channel.filters";
import { ChannelService } from "./channel.service";
import { ChannelCreateDto, ChannelJoinDto, ChannelKickDto, ChannelLeaveDto, ChannelPasswordDto, MakeOpDto, MessageCreateDto, UserBanDto, UserMuteDto } from "./dto";
import { MessageType } from "./types/message.type";
import { JwtWsGuard, UserPayload } from "src/auth/utils/JwtWsGuard";

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

	@UsePipes(new ValidationPipe({whitelist: true}))
	@SubscribeMessage('join')
	async handleJoin(@MessageBody() dto: ChannelJoinDto, @ConnectedSocket() client: Socket) {
		if (client.rooms.has(dto.name))
			throw new WsException(`error: client has already joined room ${dto.name}`);

		try {
			await this.channelService.checkUserInChannel(dto.user_id, dto.name);
			client.join(dto.name);
			this.io.in(dto.name).emit('join', dto);
		} catch (e) {
			client.leave(dto.name);
			throw new WsException(e);
		}
	}

	@UsePipes(new ValidationPipe({whitelist: true}))
	@SubscribeMessage('leave')
	async handleLeave(@MessageBody() dto: ChannelLeaveDto, @ConnectedSocket() client: Socket) {
		this.checkUser(client, dto.name);

		try {
			await this.channelService.checkUserInChannel(dto.user_id, dto.name);
			this.io.in(dto.name).emit('leave', dto);
			client.leave(dto.name);
		} catch (e) {
			client.leave(dto.name);
			throw new WsException(e);
		}
	}

	@UsePipes(new ValidationPipe({whitelist: true}))
	@SubscribeMessage('kick')
	async handleKick(@MessageBody() dto: ChannelKickDto, @ConnectedSocket() client: Socket) {
		this.checkUser(client, dto.name);

		try {
			await this.channelService.checkOperator(dto.user_id, dto.name);
			await this.channelService.checkIsNotOwner(dto.target_id, dto.name);
			await this.channelService.leave({user_id: dto.target_id, name: dto.name});

			const targetName = await this.channelService.getUserInfo(dto.target_id, "name");
			const message = {
				sender_id: dto.user_id,
				text: ` has kicked ${targetName["attribute"]}`,
				type: MessageType.Kick,
				uid: 0,
				name: dto.name,
			};

			this.channelService.postMessage(message);
			this.io.in(dto.name).emit('kick', dto);
			this.io.in(dto.name).emit('message', message);
		} catch (e) {
			throw new WsException(e);
		}
	}

	@UseGuards(JwtWsGuard)
	@UsePipes(new ValidationPipe({whitelist: true}))
	@SubscribeMessage('message')
	async handleMessage(@MessageBody() dto: MessageCreateDto, @ConnectedSocket() client: Socket, @UserPayload() payload: any) {
		this.checkUser(client, dto.name);
		try {
			const messageData = {
				name: dto.name,
				sender_id: payload.sub,
				uid: dto.uid,
				text: dto.text,
				type: MessageType.Normal,
			};
			const message = await this.channelService.postMessage(messageData);
			this.io.in(dto.name).emit('message', message);
		} catch (e) {
			this.logger.log(e);
			throw new WsException(e);
		}
	}

	@UsePipes(new ValidationPipe({whitelist: true}))
	@SubscribeMessage('mute')
	async handleMute(@MessageBody() dto: UserMuteDto, @ConnectedSocket() client: Socket) {
		this.checkUser(client, dto.name);
		try {
			await this.channelService.checkOperator(dto.user_id, dto.name);
			await this.channelService.mute(dto);

			const targetName = await this.channelService.getUserInfo(dto.target_id, "name");
			const message = {
				sender_id: dto.user_id,
				text: ` has muted ${targetName["attribute"]} for ${dto.mute_duration} seconds`,
				type: MessageType.Mute,
				uid: 0,
				name: dto.name,
			};

			this.channelService.postMessage(message);
			this.io.in(dto.name).emit('mute', dto);
			this.io.in(dto.name).emit('message', message);
		} catch (e) {
			throw new WsException(e);
		}
	}

	@UsePipes(new ValidationPipe({whitelist: true}))
	@SubscribeMessage('ban')
	async handleBan(@MessageBody() dto: UserBanDto, @ConnectedSocket() client: Socket) {
		this.checkUser(client, dto.name);
		try {
			await this.channelService.checkOperator(dto.user_id, dto.name);
			await this.channelService.ban(dto);

			const targetName = await this.channelService.getUserInfo(dto.target_id, "name");
			const message = {
				sender_id: dto.user_id,
				text: ` has banned ${targetName["attribute"]}`,
				type: MessageType.Ban,
				uid: 0,
				name: dto.name,
			};

			this.channelService.postMessage(message);
			this.io.in(dto.name).emit('ban', dto);
			this.io.in(dto.name).emit('message', message);
		} catch (e) {
			throw new WsException(e);
		}
	}

	@UsePipes(new ValidationPipe({whitelist: true}))
	@SubscribeMessage('makeop')
	async handleMakeOp(@MessageBody() dto: MakeOpDto, @ConnectedSocket() client: Socket) {
		this.checkUser(client, dto.name);
		try {
			await this.channelService.checkOperator(dto.user_id, dto.name);
			await this.channelService.makeOp(dto);

			this.io.in(dto.name).emit('makeop', dto);
		} catch (e) {
			throw new WsException(e);
		}
	}

	@UsePipes(new ValidationPipe({whitelist: true}))
	@SubscribeMessage('password')
	async handlePasswordChange(@MessageBody() dto: ChannelPasswordDto, @ConnectedSocket() client: Socket) {
		this.checkUser(client, dto.name);
		try {
			await this.channelService.checkIsOwner(dto.user_id, dto.name);
			await this.channelService.changePassword(dto);

			this.io.in(dto.name).emit('password');
		} catch (e) {
			throw new WsException(e);
		}
	}

	checkUser(client: Socket, channel: string) {
		if (!client.rooms.has(channel))
			throw new WsException(`error: client hasnt joined room ${channel}`);
	}
}

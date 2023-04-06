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

	private userMap = new Map<number, string>();

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
		this.removeSocketId(client.id);
		this.logger.log(`Disconnected socket ${client.id}.`);
	}

	@UseGuards(JwtWsGuard)
	@UsePipes(new ValidationPipe({whitelist: true}))
	@SubscribeMessage('join')
	async handleJoin(@MessageBody() dto: ChannelJoinDto, @ConnectedSocket() client: Socket, @UserPayload() payload: any) {
		const data = {
			name: dto.name,
			user_id: payload.sub
		};

		if (client.rooms.has(data.name))
			throw new WsException(`error: client has already joined room ${data.name}`);

		try {
			await this.channelService.checkUserInChannel(data.user_id, data.name);
			client.join(data.name);
			this.userMap.set(data.user_id, client.id)
			this.io.in(data.name).emit('join', data);
		} catch (e) {
			throw new WsException(e);
		}
	}

	@UseGuards(JwtWsGuard)
	@UsePipes(new ValidationPipe({whitelist: true}))
	@SubscribeMessage('leave')
	async handleLeave(@MessageBody() dto: ChannelLeaveDto, @ConnectedSocket() client: Socket, @UserPayload() payload: any) {
		const data = {
			name: dto.name,
			user_id: payload.sub
		};

		this.checkUser(client, data.name);
		try {
			await this.channelService.checkUserInChannel(data.user_id, data.name);
			this.io.in(data.name).emit('leave', data);
			client.leave(data.name);
		} catch (e) {
			throw new WsException(e);
		}
	}

	@UseGuards(JwtWsGuard)
	@UsePipes(new ValidationPipe({whitelist: true}))
	@SubscribeMessage('kick')
	async handleKick(@MessageBody() dto: ChannelKickDto, @ConnectedSocket() client: Socket, @UserPayload() payload: any) {
		let data: any  = dto;
		data.user_id = payload.sub;

		this.checkUser(client, data.name);
		try {
			await this.channelService.checkOperator(data.user_id, data.name);
			await this.channelService.checkIsNotOwner(data.target_id, data.name);
			await this.channelService.leave({user_id: data.target_id, name: data.name});

			const targetName = await this.channelService.getUserInfo(data.target_id, "name");
			const messageData = {
				sender_id: data.user_id,
				text: ` has kicked ${targetName["attribute"]}`,
				type: MessageType.Kick,
				uid: 0,
				name: data.name,
			};
			const message = await this.channelService.postMessage(messageData);

			this.io.in(data.name).emit('kick', data);
			this.io.in(data.name).emit('message', message);
			this.removeFromRoom(data.target_id, data.name);
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

	@UseGuards(JwtWsGuard)
	@UsePipes(new ValidationPipe({whitelist: true}))
	@SubscribeMessage('mute')
	async handleMute(@MessageBody() dto: UserMuteDto, @ConnectedSocket() client: Socket, @UserPayload() payload: any) {
		let data: any  = dto;
		data.user_id = payload.sub;

		this.checkUser(client, data.name);
		try {
			await this.channelService.checkOperator(data.user_id, data.name);
			await this.channelService.mute(data);

			const targetName = await this.channelService.getUserInfo(data.target_id, "name");
			const messageData = {
				sender_id: data.user_id,
				text: ` has muted ${targetName["attribute"]} for ${data.mute_duration} seconds`,
				type: MessageType.Mute,
				uid: 0,
				name: data.name,
			};
			const message = await this.channelService.postMessage(messageData);

			this.io.in(data.name).emit('mute', data);
			this.io.in(data.name).emit('message', message);
		} catch (e) {
			throw new WsException(e);
		}
	}

	@UseGuards(JwtWsGuard)
	@UsePipes(new ValidationPipe({whitelist: true}))
	@SubscribeMessage('ban')
	async handleBan(@MessageBody() dto: UserBanDto, @ConnectedSocket() client: Socket, @UserPayload() payload: any) {
		let data: any  = dto;
		data.user_id = payload.sub;

		this.checkUser(client, data.name);
		try {
			await this.channelService.checkOperator(data.user_id, data.name);
			await this.channelService.ban(data);

			const targetName = await this.channelService.getUserInfo(data.target_id, "name");
			const messageData = {
				sender_id: data.user_id,
				text: ` has banned ${targetName["attribute"]}`,
				type: MessageType.Ban,
				uid: 0,
				name: data.name,
			};

			const message = await this.channelService.postMessage(messageData);

			this.io.in(data.name).emit('ban', data);
			this.io.in(data.name).emit('message', message);
			this.removeFromRoom(data.target_id, data.name);
		} catch (e) {
			throw new WsException(e);
		}
	}

	@UseGuards(JwtWsGuard)
	@UsePipes(new ValidationPipe({whitelist: true}))
	@SubscribeMessage('makeop')
	async handleMakeOp(@MessageBody() dto: MakeOpDto, @ConnectedSocket() client: Socket, @UserPayload() payload: any) {
		let data: any  = dto;
		data.user_id = payload.sub;

		this.checkUser(client, data.name);
		try {
			await this.channelService.checkOperator(data.user_id, data.name);
			await this.channelService.makeOp(data);

			this.io.in(data.name).emit('makeop', data);
		} catch (e) {
			throw new WsException(e);
		}
	}

	@UseGuards(JwtWsGuard)
	@UsePipes(new ValidationPipe({whitelist: true}))
	@SubscribeMessage('password')
	async handlePasswordChange(@MessageBody() dto: ChannelPasswordDto, @ConnectedSocket() client: Socket, @UserPayload() payload: any) {
		let data: any  = dto;
		data.user_id = payload.sub;

		this.checkUser(client, data.name);
		try {
			await this.channelService.checkIsOwner(data.user_id, data.name);
			await this.channelService.changePassword(data);

			this.io.in(data.name).emit('password');
		} catch (e) {
			throw new WsException(e);
		}
	}

	checkUser(client: Socket, channel: string) {
		if (!client.rooms.has(channel))
			throw new WsException(`error: client hasnt joined room ${channel}`);
	}

	getSocketId(userId: number) {
		return this.userMap.get(userId);
	}

	removeSocketId(clientId: string) {
		for (const [userId, socketId] of this.userMap.entries()) {
			if (socketId === clientId) {
				this.userMap.delete(userId);
				break;
			}
		}
	}

	removeFromRoom(userId: number, room: string) {
		const socketId = this.getSocketId(userId);
		if (!socketId)
			return ;

		const socket = this.io.sockets.get(socketId);
		if (!socket)
			return ;

		socket.leave(room);
	}
}

import { Logger, UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Socket, Namespace } from "socket.io";
import { BadRequestFilter } from "./dm.filters";
import { DmService } from "./dm.service";
import { DmCreateDto, DmJoinDto, DmLeaveDto } from "./dto";
import { JwtWsGuard, UserPayload } from "src/auth/utils/JwtWsGuard";

@UseFilters(new BadRequestFilter())
@UsePipes(new ValidationPipe({whitelist: true}))
@WebSocketGateway({namespace: 'dm'})
export class DmGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private logger = new Logger(DmGateway.name);

	private userMap = new Map<number, string>();

	@WebSocketServer() io: Namespace;

	constructor (private readonly dmService: DmService) {}

	afterInit() {
		this.logger.log('Websocket dm initialized.');
	}

	handleConnection(client: Socket) {
		this.logger.log(`New client with id: ${client.id}`);
		this.logger.log(`Number of connection: ${this.io.sockets.size}`);
	}

	handleDisconnect(client: Socket) {
		this.removeSocketId(client.id);
		this.logger.log(`Disconnected client with id: ${client.id}`);
	}

	@UseGuards(JwtWsGuard)
	@SubscribeMessage('ping')
	async handlePing(@ConnectedSocket() client: Socket, @UserPayload() payload: any) {
		this.userMap.set(payload.sub, client.id);
		this.io.to(client.id).emit('pong');
	}

	@UseGuards(JwtWsGuard)
	@SubscribeMessage('join')
	async handleJoin(@MessageBody() dto: DmJoinDto, @ConnectedSocket() client: Socket, @UserPayload() payload: any) {
		const data: any = {
			sender_id: payload.sub,
			receiver_id: dto.receiver_id,
		};

		const roomName: string = this.getRoomName(data.sender_id, data.receiver_id);
		if (client.rooms.has(roomName))
			throw new WsException(`error: client has already joined this room`);

		this.userMap.set(payload.sub, client.id);
		try {
			await this.dmService.checkUser(data.sender_id);
			await this.dmService.checkUser(data.receiver_id);

			client.join(roomName);
			this.io.in(roomName).emit('join', data);

			const target = this.userMap.get(data.receiver_id);
			if (target && this.io.sockets.has(target)) {
				this.io.to(target).emit('join', data);
			}
		} catch (e) {
			client.leave(roomName);
			throw new WsException(e);
		}
	}

	@UseGuards(JwtWsGuard)
	@SubscribeMessage('leave')
	async handleLeave(@MessageBody() dto: DmLeaveDto, @ConnectedSocket() client: Socket, @UserPayload() payload: any) {
		const user_id: number = payload.sub;
		const roomName: string = this.getRoomName(user_id, dto.receiver_id);

		this.checkUser(client, roomName);

		this.io.in(roomName).emit('leave', {user_id: user_id});
		client.leave(roomName);
	}

	@UseGuards(JwtWsGuard)
	@SubscribeMessage('message')
	async handleMessage(@MessageBody() dto: DmCreateDto, @ConnectedSocket() client: Socket, @UserPayload() payload: any) {
		const data: any = dto;
		data.sender_id = payload.sub;

		const roomName: string = this.getRoomName(data.sender_id, data.receiver_id);
		this.checkUser(client, roomName);

		try {
			await this.dmService.checkUser(data.sender_id);
			await this.dmService.checkUser(data.receiver_id);

			const message = await this.dmService.post(data);
			this.io.in(roomName).emit('message', message);
		} catch (e) {
			this.logger.log(e);
			throw new WsException(e);
		}
	}

	getRoomName(user1: number, user2: number): string {
		return Math.min(user1, user2) + '+' + Math.max(user1, user2);
	}

	checkUser(client: Socket, roomName: string) {
		if (!client.rooms.has(roomName))
			throw new WsException(`error: client hasn't joined this room`);
	}

	removeSocketId(clientId: string) {
		for (const [userId, socketId] of this.userMap.entries()) {
			if (socketId === clientId) {
				this.userMap.delete(userId);
				break;
			}
		}
	}
}

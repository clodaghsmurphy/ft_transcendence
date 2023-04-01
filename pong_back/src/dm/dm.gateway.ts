import { Logger, UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Socket, Namespace } from "socket.io";
import { BadRequestFilter } from "./dm.filters";
import { DmService } from "./dm.service";
import { DmCreateDto, DmJoinDto } from "./dto";
import { JwtWsGuard } from "src/auth/utils/JwtWsGuard";

@UseFilters(new BadRequestFilter())
@WebSocketGateway({namespace: 'dm'})
export class DmGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private logger = new Logger(DmGateway.name);

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
		this.logger.log(`Disconnected client with id: ${client.id}`);
		this.logger.log(`Number of connection: ${this.io.sockets.size}`);
	}

	@UseGuards(JwtWsGuard)
	@UsePipes(new ValidationPipe({whitelist: true}))
	@SubscribeMessage('join')
	async handleJoin(@MessageBody() dto: DmJoinDto, @ConnectedSocket() client: Socket) {
		const roomName: string = this.getRoomName(dto.sender_id, dto.receiver_id);

		if (client.rooms.has(roomName))
			throw new WsException(`error: client has already joined this room`);

		try {
			client.join(roomName);
			this.io.in(roomName).emit('join');
		} catch (e) {
			client.leave(roomName);
			throw new WsException(e);
		}
	}

	@UsePipes(new ValidationPipe({whitelist: true}))
	@SubscribeMessage('message')
	async handleMessage(@MessageBody() dto: DmCreateDto, @ConnectedSocket() client: Socket) {
		const roomName: string = this.getRoomName(dto.sender_id, dto.receiver_id);
		this.checkUser(client, roomName);

		try {
			const message = await this.dmService.post(dto);
			this.io.in(roomName).emit('message', message);
		} catch (e) {
			this.logger.log(e);
			throw new WsException(e);
		}
	}

	getRoomName(user1: number, user2: number): string {
		return Math.min(user1, user2) + ';' + Math.max(user1, user2);
	}

	checkUser(client: Socket, roomName: string) {
		if (!client.rooms.has(roomName))
			throw new WsException(`error: client hasn't joined this room`);
	}
}

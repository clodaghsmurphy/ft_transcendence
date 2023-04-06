import { HttpException, Logger, UseFilters, UsePipes, ValidationPipe } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Socket, Namespace } from 'socket.io';
import { BadRequestFilter } from "./game.filters";
import { GameService } from "./game.service";
import { GameCreateDto, GameJoinDto, GameLeaveDto, MovementDto } from "./dto";

// import { Logger, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
// import { Socket, Namespace } from 'socket.io';

@WebSocketGateway({namespace: 'game'})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
private logger = new Logger(GameGateway.name);

	@WebSocketServer() io: Namespace;

	constructor (private readonly gameService: GameService) {}

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
	async handleJoin(@MessageBody() dto: GameJoinDto, @ConnectedSocket() client: Socket) {
		if (client.rooms.has(dto.room_id.toString()))
			throw new WsException(`error: client has already joined room ${dto.room_id}`);
		try {
			await this.gameService.checkUserInChannel(dto.user_id, dto.room_id);
			client.join(dto.room_id.toString());
			this.io.in(dto.room_id.toString()).emit('join', dto);
		} catch (e) {
			client.leave(dto.room_id.toString());
			throw new WsException(e);
		}
	}
}

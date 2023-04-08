import { HttpException, Logger, UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Socket, Namespace, Server } from 'socket.io';
import { BadRequestFilter } from "./game.filters";
import { GameService } from "./game.service";
import { JwtWsGuard } from "src/auth/utils/JwtWsGuard";
import { GameJoinDto, GameKeyDto } from "./dto";

@UseFilters(new BadRequestFilter())
@UsePipes(new ValidationPipe({whitelist: true}))
@WebSocketGateway({namespace: 'game'})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private logger = new Logger(GameGateway.name);

	@WebSocketServer() io: Namespace;

	constructor (private gameService: GameService) {}

	afterInit() {
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
	async handleJoin(@MessageBody() dto: GameJoinDto, @ConnectedSocket() client: Socket) {
		await this.gameService.checkUserInGame(dto.user_id, dto.id);

		client.join('' + dto.id);
		this.io.in('' + dto.id).emit('join', dto);

		// Starting as soon as one player joined for testing purposes
		// if (this.io.adapter.rooms.get('' + dto.id).size === 2) {
		this.io.in('' + dto.id).emit('gamestart');
		this.gameService.startGame(dto.id, this.io);
		// }
	}

	@SubscribeMessage('keyEvent')
	async handleKeyEvent(@MessageBody() dto: GameKeyDto, @ConnectedSocket() client: Socket) {
		this.gameService.checkUserIsPlayer(dto.user_id, dto.id);
		this.gameService.keyEvent(dto);
	}
}

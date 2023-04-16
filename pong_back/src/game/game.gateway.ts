import { Logger, UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Socket, Namespace } from 'socket.io';
import { BadRequestFilter } from "./game.filters";
import { GameService } from "./game.service";
import { GameInviteChanDto, GameInviteDmDto, GameJoinDto, GameKeyDto, GameRemoveDto } from "./dto";
import { JwtWsGuard, UserPayload } from "src/auth/utils/JwtWsGuard";
import { DmGateway } from "src/dm/dm.gateway";
import { ChannelGateway } from "src/channel/channel.gateway";

@UseFilters(new BadRequestFilter())
@UsePipes(new ValidationPipe({whitelist: true}))
@WebSocketGateway({namespace: 'game'})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private logger = new Logger(GameGateway.name);

	@WebSocketServer() io: Namespace;

	constructor (private gameService: GameService, private dmGateway: DmGateway, private channelGateway: ChannelGateway) {}

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

	@UseGuards(JwtWsGuard)
	@SubscribeMessage('join')
	async handleJoin(@MessageBody() dto: GameJoinDto, @ConnectedSocket() client: Socket, @UserPayload() payload: any) {
		client.join('' + dto.id);
		const room = await this.gameService.join(dto.id, payload.sub);

		this.io.in('' + dto.id).emit('join', room);
		if (this.gameService.readyToStart(dto.id)) {
			this.gameService.startGame(dto.id, this.io);
		}
	}

	@UseGuards(JwtWsGuard)
	@SubscribeMessage('invite_dm')
	async handleInviteDm(@MessageBody() dto: GameInviteDmDto, @UserPayload() payload: any, @ConnectedSocket() client: Socket) {
		await this.dmGateway.handleGameInvite(dto.id, dto.target_id, payload.sub);
	}

	@UseGuards(JwtWsGuard)
	@SubscribeMessage('invite_chan')
	async handleInviteChan(@MessageBody() dto: GameInviteChanDto, @ConnectedSocket() client: Socket, @UserPayload() payload: any) {
		await this.channelGateway.handleGameInvite(dto.name, dto.id, payload.sub);
	}

	@UseGuards(JwtWsGuard)
	@SubscribeMessage('keyEvent')
	async handleKeyEvent(@MessageBody() dto: GameKeyDto, @ConnectedSocket() client: Socket, @UserPayload() payload: any) {
		this.gameService.checkUserIsPlayer(payload.sub, dto.id);
		this.gameService.keyEvent(dto);
	}

	@UseGuards(JwtWsGuard)
	@SubscribeMessage('leave')
	async handleLeave(@MessageBody() dto: GameRemoveDto, @UserPayload() payload: any) {
		this.gameService.leave(dto.id, payload.sub);
	}
}

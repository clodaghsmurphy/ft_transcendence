import { HttpException, Logger, UseFilters, UsePipes, ValidationPipe } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Game } from "@prisma/client";
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

afterInit() {
	this.logger.log('Websocket gateway initialized.');
}

handleConnection(client: Socket) {
	this.logger.log(`Client with id: ${client.id} connected.`);
  
	// Send a welcome message to the client
	client.emit('message', { content: 'Welcome to the game!' });
}
  

handleDisconnect(client: Socket) {
	this.logger.log('Disconnected client with id: ${client.id}.');
	this.logger.log('Number of connections: ${this.io.sockets.size}.');
}
}





// @UseFilters(new BadRequestFilter())
// @WebSocketGateway({namespace: 'game'})
// export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
// 	private logger = new Logger(GameGateway.name);

// 	@WebSocketServer() io: Namespace;

// 	constructor (private readonly channelService: GameService) {}

// 	afterInit() {
// 		this.logger.log('Websocket gateway initialized.');
// 	}

// 	handleConnection(client: Socket) {
// 		this.logger.log(`New client with id: ${client.id} connected.`);
// 		this.logger.log(`Number of connection: ${this.io.sockets.size}.`);
// 	}

// 	handleDisconnect(client: Socket) {
// 		this.logger.log(`Disconnected client with id: ${client.id}.`);
// 		this.logger.log(`Number of connection: ${this.io.sockets.size}.`);
// 	}

// 	@SubscribeMessage('join')
// 	async handleJoin(@MessageBody() dto: GameJoinDto, @ConnectedSocket() client: Socket) {
// 		if (client.rooms.has(dto.name))
// 			throw new WsException(`error: client has already joined room ${dto.name}`);

// 		try {
// 			await this.channelService.checkUserInGame(dto.user_id, dto.name);
// 			client.join(dto.name);
// 			this.io.in(dto.name).emit('join', {name: dto.name, user: dto.user_id});
// 		} catch (e) {
// 			client.leave(dto.name);
// 			throw new WsException(e);
// 		}
// 	}

// 	@SubscribeMessage('leave')
// 	async handleLeave(@MessageBody() dto: GameLeaveDto, @ConnectedSocket() client: Socket) {
// 		this.checkUser(client, dto.name);

// 		try {
// 			await this.channelService.checkUserInGame(dto.user_id, dto.name);
// 			this.io.in(dto.name).emit('leave', {name: dto.name, user: dto.user_id});
// 			client.leave(dto.name);
// 		} catch (e) {
// 			client.leave(dto.name);
// 			throw new WsException(e);
// 		}
// 	}

// 	@SubscribeMessage('kick')
// 	async handleKick(@MessageBody() dto: GameKickDto, @ConnectedSocket() client: Socket) {
// 		this.checkUser(client, dto.name);

// 		try {
// 			await this.channelService.checkOperator(dto.user_id, dto.name);
// 			await this.channelService.leave({user_id: dto.target_id, name: dto.name});

// 			this.io.in(dto.name).emit('kick', {name: dto.name, user: dto.user_id, target: dto.target_id});
// 		} catch (e) {
// 			throw new WsException(e);
// 		}
// 	}

// 	@SubscribeMessage('message')
// 	async handleMessage(@MessageBody() dto: MessageCreateDto, @ConnectedSocket() client: Socket)
// 	{
// 		this.checkUser(client, dto.name);
// 		try {
// 			const message = await this.channelService.postMessage(dto);
// 			this.io.in(dto.name).emit('message', message);
// 		} catch (e) {
// 			this.logger.log(e);
// 			client.leave(dto.name);
// 			throw new WsException(e);
// 		}
// 	}

// 	checkUser(client: Socket, channel: string) {
// 		if (!client.rooms.has(channel))
// 			throw new WsException(`error: client hasnt joined room ${channel}`);
// 	}
// }

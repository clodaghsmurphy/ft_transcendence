import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Channel } from "@prisma/client";
import { Socket, Namespace } from 'socket.io';
import { ChannelService } from "./channel.service";
import { ChannelCreateDto, ChannelJoinDto, MessageCreateDto } from "./dto";

@WebSocketGateway({namespace: 'channel'})
export class ChannelGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private logger = new Logger(ChannelGateway.name);

	@WebSocketServer() io: Namespace;

	constructor (private readonly channelService: ChannelService) {}

	afterInit() {
		this.logger.log('Websocket gateway initialized.');
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`New client with id: ${client.id} connected.`);
		this.logger.log(`Number of connection: ${this.io.sockets.size}.`);
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Disconnected client with id: ${client.id}.`);
		this.logger.log(`Number of connection: ${this.io.sockets.size}.`);
	}

	// @SubscribeMessage('create')
	// async handleCreation(@MessageBody() dto: ChannelCreateDto): Promise<Channel> {
	// 	const channel = await this.channelService.create(dto);
	// 	this.logger.log(`Created new channel: ${channel}`);
	// 	return channel;
	// }

	@SubscribeMessage('join')
	async handleJoin(@MessageBody() dto: ChannelJoinDto, @ConnectedSocket() client: Socket) {
		await this.channelService.join(dto);
		client.join(dto.name);
		this.io.in(dto.name).emit('join', dto);
	}

	@SubscribeMessage('message')
	async handleMessage(@MessageBody('channel') channel: string, @MessageBody('data') dto: MessageCreateDto) {
		const message = await this.channelService.postMessage(channel, dto);
		this.io.in(channel).emit('message', message);
	}
}

import { Logger } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Channel } from "@prisma/client";
import { Socket, Namespace } from 'socket.io';
import { ChannelService } from "./channel.service";
import { ChannelCreateDto } from "./dto";

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

	@SubscribeMessage('create')
	async handleCreation(@MessageBody() dto: ChannelCreateDto): Promise<Channel> {
		// this.logger.log(`Channel creation message recieved:`);
		// this.logger.log(JSON.stringify(dto, null, 4));

		const channel = await this.channelService.create(dto);
		this.logger.log(`Created new channel: ${channel}`);
		return channel;
	}
}

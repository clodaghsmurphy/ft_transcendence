import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class DmService {
	constructor (private prisma: PrismaService, private userService: UserService) {}

	async get(dto: any) {
		await this.checkUser(dto.sender_id);
		await this.checkUser(dto.receiver_id);

		return await this.prisma.privateMessage.findMany({
			where: {
				OR: [
					{
						sender_id: dto.sender_id,
						receiver_id: dto.receiver_id,
					},
					{
						sender_id: dto.receiver_id,
						receiver_id: dto.sender_id,
					}
				]
			},
			orderBy: {
				created_at: 'asc'
			}
		});
	}

	async getUsers(userId: number) {
		await this.checkUser(userId);

		const user = await this.prisma.user.findUnique({
			where: {id: userId},
			include: {
				messages_sent: true,
				messages_received: true
			}
		});

		const senderIds: Set<number> = new Set(user.messages_received.map((m) => m.sender_id));
		const receiverIds: Set<number> = new Set(user.messages_sent.map((m) => m.receiver_id));
		const uniqueIds: Set<number> = new Set([...senderIds, ...receiverIds]);

		const users = await this.prisma.user.findMany({
			where: {id: {in: [...uniqueIds]}},
			select: {id: true, name: true}
		});

		return users;
	}

	async post(dto: any) {
		console.log(`Dm post called with ${JSON.stringify(dto)}`);
		const message = await this.prisma.privateMessage.create({
			data: {
				text: dto.text,
				sender: {connect: {id: dto.sender_id}},
				receiver: {connect: {id: dto.receiver_id}},
				type: dto.type,
			}
		});
		return message;
	}

	async checkUser(id: number) {
		if (await this.prisma.user.count({where: {id: id}}) == 0) {
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `User ${id} doesn't exist`,
			}, HttpStatus.BAD_REQUEST);
		}
	}
}

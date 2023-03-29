import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { DmCreateDto, DmGetDto } from "./dto";

@Injectable()
export class DmService {
	constructor (private prisma: PrismaService, private userService: UserService) {}

	async get(dto: DmGetDto) {
		await this.checkUser(dto.user1);
		await this.checkUser(dto.user2);

		return await this.prisma.privateMessage.findMany({
			where: {
				OR: [
					{
						sender_id: dto.user1,
						receiver_id: dto.user2,
					},
					{
						sender_id: dto.user2,
						receiver_id: dto.user2,
					}
				]
			},
			orderBy: {
				created_at: 'asc'
			}
		});
	}

	async post(dto: DmCreateDto) {
		const message = await this.prisma.privateMessage.create({
			data: {
				text: dto.text,
				sender: {connect: {id: dto.sender_id}},
				receiver: {connect: {id: dto.receiver_id}},
			}
		});
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

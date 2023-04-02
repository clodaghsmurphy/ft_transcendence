import { HttpException, HttpStatus, Injectable, UseGuards } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { DmCreateDto, DmGetDto } from "./dto";

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

	async post(dto: any) {
		const message = await this.prisma.privateMessage.create({
			data: {
				text: dto.text,
				sender: {connect: {id: dto.sender_id}},
				receiver: {connect: {id: dto.receiver_id}},
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

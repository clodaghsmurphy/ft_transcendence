import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { PrismaService } from "src/prisma/prisma.service";
import { UserCreateDto, UserUpdateDto } from "./dto";

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {
	}

	async getAllUsers(): Promise<User[]> {
		return await this.prisma.user.findMany();
	}

	async getUser(username: string) {
		return await this.prisma.user.findUnique({
			where: { name: username },
		});
	}

	async getUserInfo(username: string, attribute: string) {
		const user = await this.prisma.user.findUnique({
			where: { name: username },
		});
		try {
			return { attribute: user[attribute] };
		} catch (e) {
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `User ${username} doesnt exist`,
			}, HttpStatus.BAD_REQUEST);
		}
	}

	async createUser(dto: UserCreateDto) {
		return await this.prisma.user.create({
			data: {
				name: dto.name,
				avatar: dto.avatar,
				blocked_users: [],
				friend_users: [],
				channels: [],
				connected: true,
				in_game: false,
			},
		});
	}

	async updateUser(dto: UserUpdateDto) {
		return await this.prisma.user.update({
			where: { name: dto.name },
			data: dto,
		});
	}
}

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
			if (e.code === 'P2002') {
				throw new HttpException({
					status: HttpStatus.BAD_REQUEST,
					error: `User ${username} doesn't exist`,
				}, HttpStatus.BAD_REQUEST);
			}
			throw e;
		}
	}

	async createUser(dto: UserCreateDto) {
		try {
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
		} catch (e) {
			if (e.code === 'P2002') {
				throw new HttpException({
					status: HttpStatus.BAD_REQUEST,
					error: `User ${dto.name} already exists`,
				}, HttpStatus.BAD_REQUEST);
			}
			throw e;
		}
	}

	async updateUser(dto: UserUpdateDto) {
		try {
			return await this.prisma.user.update({
				where: { name: dto.name },
				data: dto,
			});
		} catch (e) {
			if (e.code === 'P2025') {
				throw new HttpException({
					status: HttpStatus.BAD_REQUEST,
					error: `User ${dto.name} doesn't exist`,
				}, HttpStatus.BAD_REQUEST);
			}
			throw e;
		}
	}
}

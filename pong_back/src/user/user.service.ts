import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { PrismaService } from "src/prisma/prisma.service";
import { UserCreateDto, UserUpdateDto } from "./dto";

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {
	}

	async getAll(): Promise<User[]> {
		return await this.prisma.user.findMany();
	}

	async get(username: string) {
		return await this.prisma.user.findUnique({
			where: { name: username },
		});
	}

	async getInfo(username: string, attribute: string) {
		try {
			const user = await this.prisma.user.findUnique({
				where: { name: username },
			});
			return { attribute: user[attribute] };
		} catch (e) {
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `User ${username} doesn't exist`,
			}, HttpStatus.BAD_REQUEST);
		}
	}

	async create(dto: UserCreateDto) {
		try {
			return await this.prisma.user.create({
				data: {
					name: dto.name,
					avatar: dto.avatar,
					blocked_users: [],
					friend_users: [],
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

	async update(dto: UserUpdateDto) {
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

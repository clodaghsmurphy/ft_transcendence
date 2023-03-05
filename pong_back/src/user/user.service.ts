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

	async get(username: string): Promise<User> {
		return await this.prisma.user.findUnique({
			where: { name: username },
		});
	}

	async userExists(name: string): Promise<User> {
		const user = await this.prisma.user.findUnique({
			where: { name: name },
		});
		console.log('name : ' + name);
		console.log('user ');
		console.log(user);
		return user;
	}

	async getInfo(username: string, attribute: string) {
		this.checkUser(username);

		const user = await this.prisma.user.findUnique({
			where: { name: username },
		});
		return { attribute: user[attribute] };
	}

	async create(dto: UserCreateDto): Promise<User> {
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

	async update(dto: UserUpdateDto): Promise<User> {
		this.checkUser(dto.name);

		return await this.prisma.user.update({
			where: { name: dto.name },
			data: dto,
		});
	}

	async checkUser(username: string) {
		if (await this.prisma.user.count({where: {name: username}}) == 0)
		{
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `User ${username} doesn't exist`,
			}, HttpStatus.BAD_REQUEST);
		}
	}
}

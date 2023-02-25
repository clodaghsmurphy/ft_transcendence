import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {
	}

	async getAllUsers(): Promise<User[]> {
		return await this.prisma.user.findMany();
	}

	async findUser(username: string): Promise<User> {
		return await this.prisma.user.findUnique({
			where: {
				name: username,
			},
		});
	}
}

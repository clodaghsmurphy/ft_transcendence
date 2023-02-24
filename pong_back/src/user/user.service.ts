import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {
	}

	async info() {
		const users = await this.prisma.user.findMany();

		return users;
	}
}

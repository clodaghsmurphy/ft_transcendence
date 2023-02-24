import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient {
	constructor() {
		super({
			datasources: {
				db: {
					// TODO: Get this from env
					url: "postgresql://postgres:1234@database:5432/nest?schema=public",
				},
			},
		});
	}
}

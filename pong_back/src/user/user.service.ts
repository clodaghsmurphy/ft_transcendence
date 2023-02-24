import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

@Injectable({})
export class UserService {
	info() {
		return { msg : "service user info" };
	}
}

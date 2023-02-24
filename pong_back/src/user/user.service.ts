import { Injectable } from "@nestjs/common";

@Injectable({})
export class UserService {
	info() {
		return { msg : "service user info" };
	}
}

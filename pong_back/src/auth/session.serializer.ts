import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SessionSerializer extends PassportSerializer {
    serializeUser(user: any, done: Function) {
        done(null, user);
    }
    deserializeUser(payload: any, done: Function) {
        done(null, payload);
    }
}
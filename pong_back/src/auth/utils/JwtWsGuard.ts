import { CanActivate, ExecutionContext, Injectable, createParamDecorator } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Observable } from "rxjs";

@Injectable()
export class JwtWsGuard extends AuthGuard('jwt') implements CanActivate {
	constructor (private jwtService: JwtService) {
		super();
		this.jwtService = jwtService;
	}

	canActivate(context: ExecutionContext):
		boolean | Promise<boolean> | Observable<boolean> {
			const req = context.switchToWs().getClient();
			const authToken = req.handshake.headers.authorization.split(' ')[1];

			try {
				req.user = this.jwtService.verify(authToken, {secret: process.env.JWT_TOKEN});
			} catch (e) {
				return false;
			}
			return true;
	}
}

export const UserPayload = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
		const jwtService = new JwtService();
		const req = context.switchToWs().getClient();
		const authToken = req.handshake.headers.authorization.split(' ')[1];

		return jwtService.decode(authToken);
	}
);

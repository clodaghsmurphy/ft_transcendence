import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Observable } from "rxjs";
import { jwtConstants } from "../constants";

@Injectable()
export class JwtWsGuard extends AuthGuard('jwt') implements CanActivate {
	constructor (private jwtService: JwtService) {
		super();
	}

	canActivate(context: ExecutionContext):
		boolean | Promise<boolean> | Observable<boolean> {
			const req = context.switchToWs().getClient();
			const authToken = req.handshake.headers.authorization.split(' ')[1];
			console.log(`authToken: ${authToken}`);

			try {
				req.user = this.jwtService.verify(authToken, {
					secret: jwtConstants.secret,
				});
			} catch (e) {
				return false;
			}
			return true;
	}
}

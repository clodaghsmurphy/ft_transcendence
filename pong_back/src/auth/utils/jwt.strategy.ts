import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { jwtConstants } from '../constants';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private userService: UserService) {
		super({
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		 ignoreExpiration: false,
		 secretOrKey: jwtConstants.secret,
			})
	}

	async validate(payload: any)
	{
		console.log('In jwt strategy and palyoad is');
		console.log(payload);
		const user = await this.userService.userExists(payload.sub);
		if (!user)
			return null;
		return {
			id: payload.sub,
			name: payload.name,
		};
	}
}
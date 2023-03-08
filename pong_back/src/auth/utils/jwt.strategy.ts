import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private userService: UserService) {
		super({
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		 ignoreExpiration: false,
		 secretOrKey: process.env.JWT_SECRET,
			})
	}

	async validate(payload: any)
	{
		const user = await this.userService.userExists(payload.name);
		if (!user)
			return null;
		return {
			id: payload.sub,
			name: payload.name,
		};
	}
}
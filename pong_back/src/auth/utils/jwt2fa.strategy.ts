import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';


@Injectable()
export class Jwt2faStrategy extends PassportStrategy(Strategy, 'jwt-two-factor') {
	constructor(private userService: UserService) {
		super({
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		 ignoreExpiration: false,
		 secretOrKey: process.env.JWT_TOKEN,
			})
	}

	async validate(payload: any)
	{
		const user = await this.userService.userExists(payload.sub);
		if (!user){
			throw new UnauthorizedException('User not found');
		}
		return user;
	}
}

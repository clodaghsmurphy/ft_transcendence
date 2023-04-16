import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
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
		if (user.otp_enabled && !user.otp_verified) {
			throw new UnauthorizedException('User has not verified two factor authentication');
		}
		if (!user){
			throw new UnauthorizedException('User not found');
		}
		return user;
	}
}

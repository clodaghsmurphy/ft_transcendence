import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { jwtConstants } from '../constants';


@Injectable()
export class Jwt2faStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
	constructor(private userService: UserService) {
		super({
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		 ignoreExpiration: false,
		 secretOrKey: jwtConstants.secret,
			})
	}

	async validate(payload: any)
	{
		console.log('In jwt2fa strategy and palyoad is');
		console.log(payload);
		const user = await this.userService.userExists(payload.sub);
		if (!user)
			throw new UnauthorizedException('User not found');
		if(user.otp_enabled && !user.otp_verified)
			throw new UnauthorizedException('User not two factor authentifcated');
		return user;
	}
}
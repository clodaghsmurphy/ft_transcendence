import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-42'

export class Ft_Strategy extends PassportStrategy(Strategy) {
    constructor(){
        super({
            clientID: process.env.REACT_APP_CLIENT_ID,
            clientSecret: process.env.REACT_APP_CLIENT_SECRET,
            callbackURL: 'http://127.0.0.1:8080/auth/42/callback'
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, cb) 
    {

    }
}
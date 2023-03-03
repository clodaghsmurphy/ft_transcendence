import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common';
import { create } from 'domain';
import { Profile, Strategy } from 'passport-42'
import { UserService } from 'src/user/user.service';
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "@prisma/client";

@Injectable()
export class Ft_Strategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService){

        super({
            clientID: process.env.REACT_APP_CLIENT_ID,
            clientSecret: process.env.REACT_APP_CLIENT_SECRET,
            callbackURL: 'http://127.0.0.1:3042/auth/42/redirect'
        });
    }
    
    async validate(accessToken: string, refreshToken: string, profile: Profile, cb:any) 
    {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        console.log('cb is ');
        console.log(cb);
        console.log(profile._json.image.link);

        const userData = {
            name: profile.username,
            id: profile.id,
            avatar: profile._json.image.link
        }
        console.log('before user exits');
            
        const user = this.userService.userExists(userData.name);
        if (!user)
            this.userService.create(userData);
        return user;
    }
}
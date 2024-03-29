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
            callbackURL: 'http://' + process.env.HOSTNAME + ':8080/api/auth/42/redirect',
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, cb:any)
    {
        const userData = {
            name: profile.username,
            id: parseInt(profile.id),
            avatar: 'http://' + process.env.HOSTNAME + `:8080/api/user/image/${profile.id}`,
            avatar_path: profile._json.image.link,
        }
        const user = await this.userService.userExists(userData.id);
        if (!user) {
            return await this.userService.create(userData); 
        }
        return user;
    }
}

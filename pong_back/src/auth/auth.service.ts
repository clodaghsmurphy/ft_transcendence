import { Injectable, Res, Req, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from "@prisma/client";
import { UserService } from 'src/user/user.service';


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,
        private jwtService: JwtService,
        private userService: UserService
        ) {}


        async login(@Res() res : Response, user: any) {
            if (!user)
                throw new HttpException('Failed to login', HttpStatus.UNAUTHORIZED);
            const payload = { name: user.name,
                otp_enabled: user.otp_enabled,
                otp_verified: user.otp_verified,
                sub: user.id
            };
            if (!user.otp_enabled ) {
                await this.userService.update({...user, connected:true})
            }
            return {
                access_token: this.jwtService.sign(payload, {secret: process.env.JWT_TOKEN}),
            }
        }

        async login2fa(@Res() res, user: User) {
            if (!user)
                throw new HttpException('Failed to login', HttpStatus.UNAUTHORIZED);
            const payload = { name: user.name,
                    otp_enabled: user.otp_enabled,
                    otp_verified: user.otp_verified,
                    sub: user.id
                };
        }

        async generateOTP(req: Request, res: Response)
        {
        }

}


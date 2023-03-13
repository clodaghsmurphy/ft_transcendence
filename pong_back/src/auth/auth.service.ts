import { Injectable, Res, Req, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,
        private jwtService: JwtService,
        ) {}


        async login(@Res() res : Response, user: any) {
            if (!user)
                throw new HttpException('Failed to login', HttpStatus.UNAUTHORIZED);
            console.log('in login and paylaod is ');
            const payload = { name: user.name, opt_enabled: user.opt_enabled, sub: user.id};
            console.log(payload);
            return {
                access_token: this.jwtService.sign(payload),
            }
        }

        async generateOTP(req: Request, res: Response) 
        {
            console.log(test);
        }
    
}


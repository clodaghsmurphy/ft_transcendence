import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,
        private jwtService: JwtService,
        ) {}


        async login(user: any) {
            console.log('in llogin and user is');
            console.log(user);
            const payload = { name: user.name, sub: user.id};
            return {
                access_token: this.jwtService.sign(payload),
            }
        }
    
}


import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,
        private jwtService: JwtService,
        ) {}

        generateJwt(payload) {
            return this.jwtService.sign(payload)
        }

        async login(user: any) {
            
            const payload = { name: user.name, sub: user.id};

            return {
                access_token: this.jwtService.sign(payload),
            }
        }
    
}


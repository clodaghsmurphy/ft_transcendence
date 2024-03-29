import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController }   from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { Ft_Strategy } from './utils/42.strategy';
import { JwtStrategy } from './utils/jwt.strategy';
import { Jwt2faStrategy } from './utils/jwt2fa.strategy';
import { SessionSerializer } from './session.serializer';
import { JwtModule, JwtService } from '@nestjs/jwt';


@Module({
    controllers: [AuthController],
    providers: [AuthService, Ft_Strategy, SessionSerializer, JwtStrategy, Jwt2faStrategy, JwtService],
    imports: [UserModule,
    PassportModule, JwtModule.register(
        {
            secret: process.env.JWT_TOKEN,
            signOptions: { expiresIn: '1d'},
        }
    )]
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController }   from './auth.controller';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { Ft_Strategy } from './utils/42.strategy';
import { SessionSerializer } from './session.serializer';
import { JwtModule } from '@nestjs/common';

@Module({
    controllers: [AuthController],
    providers: [AuthService, Ft_Strategy, SessionSerializer],
    imports: [UserModule,
    PassportModule, JwtModule.register(
        {
            secret: process.env.
        }
    )]
})
export class AuthModule {}
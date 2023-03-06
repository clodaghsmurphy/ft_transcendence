import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController }   from './auth.controller';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { Ft_Strategy } from './utils/42.strategy';
import { SessionSerializer } from './session.serializer';

@Module({
    controllers: [AuthController],
    providers: [AuthService, Ft_Strategy, SessionSerializer],
    imports: [UserModule,
    PassportModule]
})
export class AuthModule {}
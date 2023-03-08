import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ChannelModule } from './channel/channel.module';
import { Ft_Strategy } from './auth/utils/42.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true}), UserModule, PrismaModule, ChannelModule, AuthModule, PassportModule],
})
export class AppModule {}

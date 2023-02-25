import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ChannelModule } from './channel/channel.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, PrismaModule, ChannelModule],
})
export class AppModule {}

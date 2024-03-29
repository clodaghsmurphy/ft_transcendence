import { Module } from '@nestjs/common';
import { AchievementsController } from './achievements.controller';
import { AchievementsService } from './achievements.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/utils/jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';


@Module({
    controllers: [AchievementsController],
    providers: [AchievementsService,JwtStrategy, JwtService],
    imports: [UserModule,
    PassportModule, JwtModule]
})
export class AchievementsModule {}

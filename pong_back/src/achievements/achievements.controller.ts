import { Body, UseGuards, Controller, Get, Res, HttpException, HttpStatus, Param, Post, Req } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/utils/JwtGuard";
import * as fs from 'fs';
import { PrismaService } from "src/prisma/prisma.service";
import { UserEntity } from "src/user/utils/user.decorator";
import { AchievementsService } from "./achievements.service";
import { UserService } from "src/user/user.service";
import { User, Stats, Achievements} from '@prisma/client';
import { DefaultAchievements } from "src/user/utils/user.types";
import { AchievementsList } from "src/user/utils/user.types";


@Controller('achievements')
export class AchievementsController {
    constructor(private achievementsService: AchievementsService,
        private userService: UserService,
        private prisma: PrismaService) {}

    @Get('health-check')
    health() {
        return { msg: 'OK'}
    }

    @Get('stats')
    @UseGuards(JwtAuthGuard)
    async getStats(@Res() res, @UserEntity() usr) {
        const result : Stats = await this.userService.getStats(usr);
        res.status(200);
        res.send(result);
    }

    @Get('achievements')
    @UseGuards(JwtAuthGuard)
    async getAchievemnts( @UserEntity() usr) {
        console.log('in acheivements');
        return this.achievementsService.getAchievements(usr);	
    }

    @Get('achievements-list')
    getAchievements() : AchievementsList[] {
        return DefaultAchievements;
    }

    @Get('achievement-icon')
    getIcon(@Body() body) {
        console.log(body);
        return this.achievementsService.getIcon(body.title);
    }
}
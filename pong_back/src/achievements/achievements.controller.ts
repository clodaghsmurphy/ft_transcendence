import { Body, UseGuards, Controller, Get, Res, HttpException, HttpStatus,NotFoundException, Param, Post, Req } from "@nestjs/common";
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

    @Post('stats')
    @UseGuards(JwtAuthGuard)
    async getStats(@Body() body, @Res() res) {
        console.log(body.id);
        console.log(body)
        const user = await this.userService.userExists(parseInt(body.id));
        if (!user)
            throw new NotFoundException('user id not found, unable to get achievements')
        const result = await this.userService.getStats(user);
        console.log(result)
        res.status(200);
        res.send(result);
    }

    @Post('/')
    @UseGuards(JwtAuthGuard)
    async getAchievemnts(@Body() body, @UserEntity() usr) {
        console.log('in acheivements');
        console.log(body);
        const user = await this.userService.userExists(parseInt(body.id));
        if (!user)
            throw new NotFoundException('user id not found, unable to get achievements')
        const result = await this.achievementsService.getAchievements(user)
        console.log(result)
        return result;	
    }

    @Get('achievements-list')
    getAchievements() : AchievementsList[] {
        return DefaultAchievements;
    }

    @Get('achievement-icon/:title')
    async getIcon(@Param() param, @Res() res) {
        const image = await this.achievementsService.getIcon(param.title);
        res.writeHead(200, {'Content-Type': 'image/jpeg' });
		res.end(image, 'binary');
    }
}
import { Body, UseGuards, Controller, Get, Res, NotFoundException, Param, Post } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/utils/JwtGuard";
import { UserEntity } from "src/user/utils/user.decorator";
import { AchievementsService } from "./achievements.service";
import { UserService } from "src/user/user.service";


@Controller('achievements')
export class AchievementsController {
    constructor(private achievementsService: AchievementsService,
        private userService: UserService) {}

    @Get('health-check')
    health() {
        return { msg: 'OK'}
    }

    @Post('stats')
    @UseGuards(JwtAuthGuard)
    async getStats(@Body() body, @Res() res) {
        const user = await this.userService.userExists(parseInt(body.id));
        if (!user)
            throw new NotFoundException('user id not found, unable to get achievements')
        const result = await this.userService.getStats(user);
        res.status(200);
        res.send(result);
    }

    @Post('/')
    @UseGuards(JwtAuthGuard)
    async getAchievements(@Body() body, @UserEntity() usr) {
        const user = await this.userService.userExists(parseInt(body.id));
        if (!user)
            throw new NotFoundException('user id not found, unable to get achievements')
        const result = await this.achievementsService.getAchievements(user)
        return result;
    }

    @Get('achievements-list')
    @UseGuards(JwtAuthGuard)
    async getAllAchievements(@UserEntity() user) {
        if (!user)
            throw new NotFoundException('user id not found, unable to get achievements')
        return await this.achievementsService.getAllAchievements(user);
    }

    @Get('achievement-icon/:title')
    async getIcon(@Param() param, @Res() res) {
        const image = await this.achievementsService.getIcon(param.title);
        res.writeHead(200, {'Content-Type': 'image/jpeg' });
		res.end(image, 'binary');
    }
}

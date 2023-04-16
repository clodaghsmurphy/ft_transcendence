import { Body, UseGuards, Controller, Get, Res, HttpException, HttpStatus,NotFoundException, Param, Post, Req } from "@nestjs/common";
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
    async getAchievements(@Body() body, @UserEntity() usr) {
        console.log('in acheivements');
        console.log(body);
        const user = await this.userService.userExists(parseInt(body.id));
        if (!user)
            throw new NotFoundException('user id not found, unable to get achievements')
        const result = await this.achievementsService.getAchievements(user)
        console.log(result)
        return result;
    }

    @Post('achievements-list')
    @UseGuards(JwtAuthGuard)
    async getAllAchievements(@Body() body) {
        const user = await this.userService.userExists(body.id);
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

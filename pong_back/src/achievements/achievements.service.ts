import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import { JwtService } from '@nestjs/jwt';
import { User } from "@prisma/client";
import { UserService } from 'src/user/user.service';
import { DefaultAchievements } from './type/achievements.types';


@Injectable()
export class AchievementsService {
    constructor(private prisma: PrismaService,
        private jwtService: JwtService,
        private userService: UserService
        ) {}


        async getAchievements(user : User) {
            const stats = await this.prisma.stats.findUnique({
                where: {userId: user.id}
            });

            const achievements = DefaultAchievements.map((achievement) => {
                const result = {...achievement};
                const checkResult = achievement.checker(achievement.cap, stats);

                result.score = checkResult[1];
                delete result.checker;

                if (checkResult[0])
                    return result;
                else
                    return null;
            });

            return achievements.filter((achievement) => {
                return achievement !== null;
            });
        }

        async getAllAchievements(user: User) {
            const stats = await this.prisma.stats.findUnique({
                where: {userId: user.id}
            });

            const achievements = DefaultAchievements.map((achievement) => {
                const result = {...achievement};
                const checkResult = achievement.checker(achievement.cap, stats);

                result.score = checkResult[1];
                delete result.checker;

                return result;
            });

            return achievements;
        }

        async getIcon(title : string) {
            const imagePath = `/app/media/ach_icons/${title}.png`
            if (this.userService.checkIfFileExists(imagePath)){
                const image = fs.readFileSync(imagePath);
                return image;
            }
            else{
                const image = fs.readFileSync('/app/media/404.png');
                return image;
            }
        }


}

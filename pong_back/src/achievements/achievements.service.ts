import { Injectable, Res, Req, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response, Request } from 'express';
import * as fs from 'fs';
import { Achievements } from '@prisma/client'
import { JwtService } from '@nestjs/jwt';
import { User } from "@prisma/client";
import { UserService } from 'src/user/user.service';
import { AchievementsList } from 'src/user/utils/user.types';


@Injectable()
export class AchievementsService {
    constructor(private prisma: PrismaService,
        private jwtService: JwtService,
        private userService: UserService
        ) {}


        async getAchievements(user : User) {
            try {
                const result = this.prisma.achievements.findMany({
                    where: {
                        id: user.id
                    }
                })
                return result
            }
            catch(error) {
                console.log(error);
                return null;
            }
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
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Game, Message } from '@prisma/client';
import { PrismaService } from "src/prisma/prisma.service";
import { GameCreateDto, GameJoinDto, GameLeaveDto, MovementDto } from "./dto";
import * as bcrypt from 'bcrypt';
import { UserService } from "src/user/user.service";

@Injectable()
export class GameService {
	constructor (private prisma: PrismaService, private userService: UserService) {}

}

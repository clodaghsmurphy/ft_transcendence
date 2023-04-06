import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Game } from '@prisma/client';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import * as path from 'path';
import * as fs from 'fs';
import { HttpService} from '@nestjs/axios'
import { GameCreateDto } from "./dto";


@Injectable()
export class GameService {
  constructor(private prisma: PrismaService, private userService: UserService) {}

  async getAll() {
	return await this.prisma.game.findMany();
  }

  async get(id: number) {
	return await this.prisma.game.findUnique({where: {id: id}});
  }

  async create(dto) {
	await this.userService.checkUser(dto.user_id);
	await this.userService.checkUser(dto.target_id);

	const game = await this.prisma.game.create({
		data: {
			player1: {connect: dto.user_id},
			player2: {connect: dto.target_id},
		}
	});

	return game;
  }

  async checkGame(id: number) {
	if (await this.prisma.game.count({where: {id: id}}) == 0)
	{
		throw new HttpException({
			status: HttpStatus.BAD_REQUEST,
			error: `Game ${id} doesn't exist`,
		}, HttpStatus.BAD_REQUEST);
	}
  }
}


/*

	Veut rejoindre parti :
		- Check joueur existe :
		- Check si joueur deja dans partie

		- Check si parti accesible :
			Check si >= 2 jours
				Oui :
					Return nop
				OK
					Cree partie :

*/

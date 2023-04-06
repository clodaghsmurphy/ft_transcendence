import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { GameService } from "./game.service";
import { GameCreateDto, GameParams } from "./dto";
import { JwtAuthGuard } from "src/auth/utils/JwtGuard";

@Controller('game')
export class GameController {
	constructor (private gameService: GameService) {}

	@Get()
	getAllGames() {
		return this.gameService.getAll();
	}

	@Get(':id')
	getGame(@Param() params: GameParams) {
		return this.gameService.get(parseInt(params.id));
	}

	@UseGuards(JwtAuthGuard)
	@Post('create')
	createGame(@Req() request, @Body() dto: GameCreateDto) {
		const data = {
			user_id: request.user.id,
			target_id: dto.target_id,
		};
		return this.gameService.create(data);
	}
}

import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { GameService } from "./game.service";
import { GameCreateDto, GameParams, GameRemoveDto } from "./dto";
import { JwtAuthGuard } from "src/auth/utils/JwtGuard";

@Controller('game')
export class GameController {
	constructor (private gameService: GameService) {}

	@Get()
	getAllGames() {
		return this.gameService.getAll();
	}

	@Get('all')
	getAllPastGames() {
		return this.gameService.getAllPast();
	}

	@Get(':id')
	getGame(@Param() params: GameParams) {
		return this.gameService.get(parseInt(params.id));
	}

	@UseGuards(JwtAuthGuard)
	@Post('create')
	async createGame(@Req() request, @Body() dto: GameCreateDto) {
		const data = {
			user_id: request.user.id,
			target_id: dto.target_id,
		};
		return await this.gameService.create(data);
	}

	@Post('remove')
	async removeGame(@Body() dto: GameRemoveDto) {
		return await this.gameService.remove(dto.id);
	}
}

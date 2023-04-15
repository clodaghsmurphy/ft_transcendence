import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { GameService } from "./game.service";
import { GameCreateDto, GameJoinDto, GameParams, GameRemoveDto } from "./dto";
import { JwtAuthGuard } from "src/auth/utils/JwtGuard";
import { GameState, defaultState } from "./types/game.types";
import { game_maps } from "./types/games.maps";

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
		let state: GameState = {...defaultState};

		for (const property in dto) {
			if (property === 'game_map') {
				state.obstacles = [...game_maps.get(dto[property])];
			} else if (property !== 'target_id') {
				state[property] = dto[property];
			}
		}

		const data = {
			user_id: request.user.id,
			state: state
		};

		if (dto.hasOwnProperty('target_id')) {
			data['target_id'] = dto.target_id;
		}
		return await this.gameService.create(data);
	}

	@Post('remove')
	async removeGame(@Body() dto: GameRemoveDto) {
		return await this.gameService.remove(dto.id);
	}

}

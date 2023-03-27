import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { GameService } from "./game.service";
import { GameCreateDto, GameJoinDto, GameLeaveDto, MovementDto } from "./dto";

@Controller('game')
export class GameController {
	constructor (private gameService: GameService) {}

	@Get('info')
	getAllGames() {
		return this.gameService.getAll();
	}

	@Get('info/:name')
	getGame(@Param() params) {
		return this.gameService.get(params.name);
	}

	@Get('info/:name/:attribute')
	getGameInfo(@Param() params) {
		return this.gameService.getInfo(params.name, params.attribute);
	}

	@Post('create')
	createGame(@Body() dto: GameCreateDto) {
		return this.gameService.create(dto);
	}

	@Post('join')
	joinGame(@Body() dto: GameJoinDto) {
		return this.gameService.join(dto);
	}

	@Post('leave')
	leaveGame(@Body() dto: GameLeaveDto) {
		return this.gameService.leave(dto);
	}

	@Get(':name/messages')
	getAllMessages(@Param() params) {
		return this.gameService.getAllMessages(params.name);
	}
}

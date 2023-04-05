import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { GameService } from "./game.service";
import { GameCreateDto, GameJoinDto, GameLeaveDto, MovementDto } from "./dto";

@Controller('game')
export class GameController {
	constructor (private gameService: GameService) {}

	@Post('join')
	joinGame(@Body() dto: GameJoinDto) {
		return this.gameService.join(dto);
	}

}

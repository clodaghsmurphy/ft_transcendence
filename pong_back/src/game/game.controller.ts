import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { GameService } from "./game.service";
import { GameCreateDto, GameJoinDto, GameLeaveDto, MovementDto } from "./dto";

@Controller('game')
export class GameController {
	constructor (private gameService: GameService) {}

	// @Post('create')
	// createGame(@Body() dto: GameCreateDto) {
		// return this.gameService.create(dto);   /// error
	// }

}

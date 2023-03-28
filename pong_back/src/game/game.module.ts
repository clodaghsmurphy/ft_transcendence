import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { GameController } from "./game.controller";
import { GameGateway } from "./game.gateway";
import { GameService } from "./game.service";

@Module({
	controllers: [GameController],
	providers: [GameService, GameGateway],
	imports: [UserModule]
})
export class GameModule {}

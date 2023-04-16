import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { GameController } from "./game.controller";
import { GameGateway } from "./game.gateway";
import { GameService } from "./game.service";
import { DmModule } from "src/dm/dm.module";
import { DmGateway } from "src/dm/dm.gateway";
import { DmService } from "src/dm/dm.service";


@Module({
  controllers: [GameController],
  providers: [GameService, GameGateway, DmService, DmGateway],
  imports: [UserModule, DmModule]
})
export class GameModule {}

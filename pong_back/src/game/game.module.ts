import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { ChannelController } from "./game.controller";
import { ChannelGateway } from "./game.gateway";
import { ChannelService } from "./game.service";

@Module({
	controllers: [ChannelController],
	providers: [ChannelService, ChannelGateway],
	imports: [UserModule]
})
export class ChannelModule {}

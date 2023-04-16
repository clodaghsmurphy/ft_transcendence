import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { ChannelController } from "./channel.controller";
import { ChannelGateway } from "./channel.gateway";
import { ChannelService } from "./channel.service";
import { JwtService } from "@nestjs/jwt";

@Module({
	controllers: [ChannelController],
	providers: [ChannelService, ChannelGateway, JwtService],
	imports: [UserModule],
	exports: [ChannelService, ChannelGateway]
})
export class ChannelModule {}

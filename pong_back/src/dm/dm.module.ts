import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { DmController } from "./dm.controller";
import { DmGateway } from "./dm.gateway";
import { DmService } from "./dm.service";
import { JwtService } from "@nestjs/jwt";
import { AuthModule } from "src/auth/auth.module";

@Module({
	controllers: [DmController],
	providers: [DmService, DmGateway, JwtService],
	imports: [UserModule, AuthModule],
	exports: [DmGateway, DmService]
})
export class DmModule {}

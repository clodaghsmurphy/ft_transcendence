import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { DmController } from "./dm.controller";
import { DmGateway } from "./dm.gateway";
import { DmService } from "./dm.service";

@Module({
	controllers: [DmController],
	providers: [DmService, DmGateway],
	imports: [UserModule]
})
export class DmModule {}

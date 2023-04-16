import { Module } from '@nestjs/common'
import { UserController } from './user.controller';
import { UserService } from './user.service';

import { HttpModule } from '@nestjs/axios'

@Module({
	controllers: [UserController],
	imports: [HttpModule],
	providers: [UserService],
	exports: [UserService]
})
export class UserModule {}

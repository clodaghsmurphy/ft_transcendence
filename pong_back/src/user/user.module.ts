import { Module } from '@nestjs/common'
import { UserController } from './user.controller';
import { UserService } from './user.service';

import { HttpService } from '@nestjs/axios'
import { HttpModule } from '@nestjs/axios'

@Module({
	controllers: [UserController],
	imports: [HttpModule],
	providers: [UserService],
	exports: [UserService]
})
export class UserModule {}

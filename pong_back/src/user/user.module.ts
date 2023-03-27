import { Module } from '@nestjs/common'
import { UserController } from './user.controller';
import { UserService } from './user.service';

import { HttpService } from '@nestjs/common'

@Module({
	controllers: [UserController],
	providers: [UserService, HttpService
	],
	exports: [UserService]
})
export class UserModule {}

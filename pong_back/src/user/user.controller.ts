import { Body, UseGuards, Controller, Get, HttpException, HttpStatus, Param, Post, Req } from "@nestjs/common";
import { UploadedFile, UseInterceptors, ParseFilePipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'
import { UserCreateDto, UserUpdateDto } from "./dto";
import { Jwt2faAuthGuard } from "src/auth/utils/Jwt2faGuard";
import { AuthGuard } from '@nestjs/passport';
import { UserService } from "./user.service";
import { Multer } from 'multer'

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@Get('info')
	getAllUsers() {
		return this.userService.getAll();
	}

	@Get('info/:id')
	getUser(@Param() params) {
		this.checkId(params.id);
		return this.userService.get(parseInt(params.id));
	}

	@Get('info/:id/:attribute')
	getUserInfo(@Param() params) {
		this.checkId(params.id);
		return this.userService.getInfo(parseInt(params.id), params.attribute);
	}

	@Post('create')
	createUser(@Body() dto: UserCreateDto) {
		return this.userService.create(dto);
	}

	@Post('update')
	updateUser(@Body() dto: UserUpdateDto) {
		return this.userService.update(dto);
	}

	@Post('upload')
	@UseGuards(Jwt2faAuthGuard)
	@UseInterceptors(FileInterceptor('file'))
	uploadFile(@UploadedFile(
		new ParseFilePipe({
			validators: [

			]
		})
	) file: Express.Multer.File)
	{
		console.log('in upload');
		console.log(file);
		
	}
	checkId(id: string) {
		if (Number.isNaN(parseInt(id))) {
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `'${id}' is not a valid number`,
			}, HttpStatus.BAD_REQUEST);
		}
	}
}


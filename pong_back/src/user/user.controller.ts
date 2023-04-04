import { Body, UseGuards, Controller, Get, Res, HttpException, HttpStatus, Param, Post, Req } from "@nestjs/common";
import { UploadedFile, UseInterceptors, ParseFilePipe, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'
import { UserCreateDto, UserUpdateDto } from "./dto";
import { JwtAuthGuard } from "src/auth/utils/JwtGuard";
import { AuthGuard } from '@nestjs/passport';
import { UserService } from "./user.service";
import { Multer } from 'multer'
import { SharpPipe } from "./utils/sharp.pipe";
import * as path from 'path';
import * as fs from 'fs';
import { UserEntity } from "./utils/user.decorator";
import { PrismaService } from "src/prisma/prisma.service";
import { User} from '@prisma/client';



@Controller('user')
export class UserController {
	constructor(private userService: UserService, private prisma: PrismaService	) {}

	@Get('info')
	getAllUsers() {
		return this.userService.getAll();
	}

	@Get('info/:id')
	getUser(@Param() params) {
		return this.userService.get(parseInt(params.id));
	}

	@Get('info/:id/:attribute')
	getUserInfo(@Param() params) {
		this.checkId(params.id);
		return this.userService.getInfo(parseInt(params.id), params.attribute);
	}

	@Post('create')
	//delete this
	createUser(@Body() dto: UserCreateDto) {
		return this.userService.create(dto);
	}

	@Post('update')
	@UseGuards(JwtAuthGuard)
	updateUser(@Body() dto: UserUpdateDto) {
		return this.userService.update(dto);
	}

	@Post('upload')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(@UploadedFile(SharpPipe) file: string, @Res() res, @UserEntity() user)
	{
		try 
		{
			const Filepath = path.join('/app', '/uploads', file)
			const updateUser = await this.prisma.user.update({
				where: {id: user.id},
				data: { avatar_path: Filepath },
			});	
			console.log(updateUser);
			console.log(Filepath);
			return res.send(Filepath);
		}
		catch(e)
		{
			throw new UnauthorizedException();
		}
	}

	@Get('image/:id')
	async getImage(@Param('id') param, @Res() res)
	{
		const user = await this.userService.userExists(parseInt(param));
		if (!user)
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `User doesn't exist`,
			}, HttpStatus.BAD_REQUEST);
		const imagePath = user.avatar_path;
		console.log('Image path is' + imagePath);
		if (this.userService.checkIfFileExists(imagePath)){
			const image = fs.readFileSync(imagePath);
			res.writeHead(200, {'Content-Type': 'image/jpeg' });
			res.end(image, 'binary');
			return;
		}
		else{
			const image = fs.readFileSync('/app/media/norminet.jpeg');
			res.writeHead(200, {'Content-Type': 'image/jpeg' });
			res.end(image, 'binary');
		}
		
	}

	@Get('friends/:id')
	@UseGuards(JwtAuthGuard)
	async getFriends(@Param('id') id, @UserEntity() userEntity, @Res() res)
	{
		const user = await this.userService.userExists(parseInt(id));
		if (!user) {
			throw new NotFoundException(`User ID ${id} not found`);
		}
		let user_array : User[] = []
		for (let i = 0; i < user.friend_users.length; i++){
			console.log(user.friend_users[i])
			user_array[i] = await this.userService.userExists(user.friend_users[i]);
			if (!user) {
				throw new NotFoundException(`User ID ${id} in friend list not found`);
			}
		}
		res.status(200);
		res.send(user_array);
		return ;
	}

	@Post('friends-search')
	@UseGuards(JwtAuthGuard)
	async friendsList(@UserEntity() userEntity, @Body() body, @Req() req, @Res() res)
	{
		const user = await this.userService.userExists(userEntity.id);
		if (!user)
			throw  new UnauthorizedException();
		console.log('in friends search');
		console.log(body);
		console.log(body.data.value);
		const result = await this.prisma.user.findMany({
			where: {
				id: {
					notIn: user.friend_users,
				},
				NOT: {
					id: {
						equals: user.id,
					}
				},
				name: {
					startsWith: body.data.value,
					mode: 'insensitive'
					}
				},
			select: {
				name: true,
				avatar: true,
				id: true,
			}
		})
		console.log(result);
		res.send(result);

	}

	@Post('add-friend')
	@UseGuards(JwtAuthGuard)
	async AddFriend(@UserEntity() usr, @Body() body, @Res() res)
	{
		this.checkId(usr.id);
		const id = body.data.id;
		if (usr.blocked_users.indexOf(id) != -1)
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `'user id ${id}' is blocked and cannot be added`,
			}, HttpStatus.BAD_REQUEST);
		if (id != usr.id ) {
			await this.prisma.user.update({
				where: { id: usr.id },
				data: {
					friend_users: { push: id }
				},
			});
			console.log(usr.friend_users);
			res.status(200);
			res.send(`${id} added !`)
		}
	}

	@Post('delete-friend')
	@UseGuards(JwtAuthGuard)
	async deleteFriend(@Res() res, @Body() body, @UserEntity() usr)
	{
		this.checkId(usr.id);
		const friendId = body.id;
		const user = await this.prisma.user.findUnique({ where: { id: usr.id } });
		const updatedFriends = user.friend_users.filter(id => id !== friendId);
		await this.prisma.user.update({
			where: { id: usr.id },
			data: { friend_users: updatedFriends },
		});
		let user_array: User[] = []
		for (let i = 0; i < updatedFriends.length; i++) {
			user_array[i] = await this.userService.userExists(updatedFriends[i]);
		}
		res.status(200);
		res.send(user_array);
	}

	@Get('users')
	@UseGuards(JwtAuthGuard)
	async getUsers(@Res() res, @UserEntity() usr)
	{
		this.checkId(usr.id)
		const excludeid = usr.id!;
		console.log('in users and id is ' + excludeid);
		const result = await this.prisma.user.findMany({
			select: {
				name:true,
				id:true,
				avatar:true,
			},
			where: {
				id: {
					notIn: usr.friend_users,
				},
				NOT: {
					id: {
						equals:excludeid,
					}
				},

			}
		})
		res.send(result);
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


import { HttpException, HttpStatus, Injectable, Res } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { PrismaService } from "src/prisma/prisma.service";
import { UserCreateDto, UserUpdateDto } from "./dto";
import * as path from 'path';
import * as fs from 'fs';
import { HttpService} from '@nestjs/axios'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService,
		private readonly httpService: HttpService) {
	}

	async getAll() {
		const users: User[] = await this.prisma.user.findMany();

		return users.map((user) => this.returnInfo(user));
	}

	async get(id: number): Promise<User> {
		const user =  await this.prisma.user.findUnique({
			where: { id: id }
		});
		if (!user) {
			throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
		}
		return this.returnInfo(user);
	}

	async userExists(id: number): Promise<User> {
		const user = await this.prisma.user.findUnique({
			where: { id: id },
		});
		if (user === null)
			return user;
		return user;
	}

	async getInfo(id: number, attribute: string) {
		await this.checkUser(id);

		const user = await this.prisma.user.findUnique({
			where: { id: id }
		});
		if (user === null)
			return ;
		const updatedUser = this.returnInfo(user);
		return { attribute: updatedUser[attribute] };
	}

	checkIfFileExists(filePath: string): boolean {
		try {
		  fs.accessSync(filePath, fs.constants.F_OK);
		  return true;
		} catch (err) {
		  return false;
		}
	  }

	async downloadImage(cdn:string): Promise<string>
	{
		const split = cdn.split('/');
		const name = split[split.length -1];
		const pathname = path.join('/app', 'uploads', name);
		const defaultPath = path.join('/app', 'uploads', 'norminet.jpeg')
		const writer = fs.createWriteStream(pathname);
		try {
			const response = await this.httpService.axiosRef({
				url: cdn,
				method: 'GET',
				responseType: 'stream',
			});
			response.data.pipe(writer);
			return pathname;
		} catch (e) {
			return defaultPath;
		}
	}

	async create(dto: UserCreateDto) {
		try {
			const avatarPath = dto.avatar_path ? null : '/app/media/norminet.jpeg';
			const user = await this.prisma.user.create({
				data: {
					name: dto.name,
					id: dto.id,
					avatar: `http://localhost:8080/api/user/image/${dto.id}`,
					avatar_path: avatarPath ? avatarPath : await this.downloadImage(dto.avatar_path),
				},
			});
			return this.returnInfo(user);
		} catch (e) {
			if (e.code === 'P2002') {
				throw new HttpException({
					status: HttpStatus.BAD_REQUEST,
					error: `User ${dto.name} already exists`,
				}, HttpStatus.BAD_REQUEST);
			}
			throw e;
		}
	}

	async update(dto: UserUpdateDto) {
		await this.checkUser(dto.id);
		const user = await this.prisma.user.update({
			where: { id: dto.id },
			data: dto,
		});
		return this.returnInfo(user);
	}

	// This should only be called by channel service
	// Therefore it assumes user and channel both exists
	async joinChannel(id: number, channelName: string) {
		await this.prisma.user.update({
			where: { id: id },
			data: {
				channels: {push: channelName}
			},
		});
	}

	// Same here, should only be called by channel
	async leaveChannel(id: number, channelName: string) {
		const user: User = await this.prisma.user.findUnique({where: {id: id}});

		await this.prisma.user.update({
			where: {id: id},
			data: {
				channels: {set: user.channels.filter((name) => name !== channelName)}
			}
		});
	}

	async checkUser(id: number) {
		if (await this.prisma.user.count({where: {id: id}}) == 0) {
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `User ${id} doesn't exist`,
			}, HttpStatus.BAD_REQUEST);
		}
	}

	async toUserArray(users: number[]) {
		let user_array: User[] = [];
		let res:User;
		for (let i = 0; i < users.length; i++) {
			res = await this.userExists(users[i]);
			if (res) {
				user_array[i] = res;
			}
		}
		return user_array;
	}

	async getUsers( usr: User) {
		const exclude:number[] = usr.friend_users.concat(usr.blocked_users) ;
		
		const result = await this.prisma.user.findMany({
			select: {
				name:true,
				id:true,
				avatar:true,
			},
			where: {
				id: {
					notIn: exclude,
				},
				NOT: {
					id: {
						equals:usr.id,
					}
				},

			}
		})
		return result;
	}
	returnInfo(user: User) {
		let updatedUser: any = user;

		updatedUser.otp_auth_url = (user.otp_auth_url === null ? false : true);
		updatedUser.otp_base32 = (user.otp_base32 === null ? false : true);
		return updatedUser;
	}
}

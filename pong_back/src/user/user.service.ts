import { HttpException, HttpStatus, Injectable} from "@nestjs/common";
import { User, Game } from "@prisma/client";
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
					avatar: `http://${process.env.HOSTNAME}:8080/api/user/image/${dto.id}`,
					avatar_path: avatarPath ? avatarPath : await this.downloadImage(dto.avatar_path),
				},
			});
			const stats = await this.prisma.stats.create({
				data: {
					userId: dto.id
				}
			})
			return user;
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

	verifyName(name: string) {
    var regex = new RegExp("^[a-zA-Z0-9._-]*$");
	console.log(name);
    if (!regex.test(name)) {
			throw new HttpException({
				status: HttpStatus.BAD_REQUEST,
				error: `user name must not contain special characters`,
			}, HttpStatus.BAD_REQUEST);
   	 	}
	}

	async update(dto: UserUpdateDto) {
		await this.checkUser(dto.id);
		this.verifyName(dto.name)
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

	// async joinGame(id: number, roomId: number) {
	// 	await this.prisma.user.update({
	// 		where: { id: id },
	// 		data: {
	// 			games: {push: roomId}
	// 		},
	// 	});
	// }

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
			res = await this.get(users[i]);
			if (res) {
				user_array[i] = res;
			}
		}
		return user_array;
	}

	async getUsers(user: User) {
		const exclude:number[] = user.friend_users.concat(user.blocked_users) ;

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
						equals:user.id,
					}
				},

			}
		})
		return result;
	}

	async getStats(user: User)  {
		console.log('in stats')
		const result = await this.prisma.stats.findUnique({
			where: {
				userId: user.id
			},
			select: {
				lvl: true,
				total_games: true,
				wins: true,
				rating: true,
			}
		})
		console.log(result)
		return result;
	}

	async getGameInfo(user: User, game: Game) {
		const is_player1: boolean = (user.id === game.player1);

		const opponent = await this.prisma.user.findUnique({
			where: {
				id: (is_player1 ? game.player2 : game.player1)
			}
		});

		return {
			win: (game.winner === user.id),
			score: (is_player1 ? game.player1_goals : game.player2_goals),
			opponent: this.returnInfo(opponent),
			opponent_score: (is_player1 ? game.player2_goals : game.player1_goals),
			rating_change: (is_player1 ? game.player1_rating_change : game.player2_rating_change)
		};
	}

	async getGameHistory(userId: number) {
		await this.checkUser(userId);

		const user = await this.prisma.user.findUnique({where: {id: userId}});
		const games = await this.prisma.game.findMany({where: {id: {in: user.past_games}}});

		const gamePromises = games.map(async (game) => {
			const info = await this.getGameInfo(user, game);
			console.log(JSON.stringify(info));
			return info;
		});

		return await Promise.all(gamePromises);
	}

	returnInfo(user: User) {
		let updatedUser: User = { ...user };

		updatedUser.otp_auth_url = (user.otp_auth_url === null ? 'false' : 'true');
		updatedUser.otp_base32 = (user.otp_base32 === null ? 'false' : 'true');
		return updatedUser;
	}
}

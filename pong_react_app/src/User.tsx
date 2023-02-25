import React from "react";

import adam from './media/adben-mc.jpg'
import pierre from './media/ple-lez.jpg'
import clodagh from './media/clmurphy.jpg'
import nathan from './media/nguiard.jpg'
import { truncate } from "fs/promises";

export type User_last_game = {
	has_won: boolean,
	opponnent: User | string,
	score: [number, number],
}

export type User = {
	name: string,
	avatar: string,
	blocked_users: string[],
	friend_users: string[],
	channels: string[], // A cahnger par Channel[] ?
	connected: boolean,
	in_game: boolean,
	game_id: number
	// statistics: ?
	last_games: User_last_game[],
}

export function avatarOf(every_users: User[], target: string): string {
	return (typeof(every_users.find(usr => usr.name == target)?.avatar) == 'string' ?
			every_users.find(usr => usr.name == target)?.avatar as string :
			'./media/default.jpg')
}

export function sample_data(): User[] {
	let u_adam: User = {
		name: "adben-mc",
		avatar: adam,
		blocked_users: ["nguiard"],
		friend_users: ["ple-lez"],
		channels: ["Transcendence", "Illuminatis"],
		connected: false,
		in_game: false,
		game_id: -1,
		last_games: [
			{
				has_won: true,
				opponnent: "clmurphy",
				score: [10, 6],
			},
			{
				has_won: true,
				opponnent: "nguiard",
				score: [10, 4],
			},
		]
	}

	let u_clodagh: User = {
		name: "clmurphy",
		avatar: clodagh,
		blocked_users: [],
		friend_users: [],
		channels: ["Transcendence"],
		connected: true,
		in_game: true,
		game_id: 2,
		last_games: [
			{
				has_won: false,
				opponnent: "nguiard",
				score: [0, 10],
			},
		]
	}

	let u_nathan: User = {
		name: "nguiard",
		avatar: nathan,
		blocked_users: ["adben-mc"],
		friend_users: ["ple-lez", "clmurphy"],
		channels: ["Illuminatis"],
		connected: true,
		in_game: true,
		game_id: 2,
		last_games: [
			{
				has_won: true,
				opponnent: "clmurphy",
				score: [10, 0],
			},
			{
				has_won: false,
				opponnent: "adben-mc",
				score: [4, 10],
			},
		]
	}

	let u_pierre: User = {
		name: "ple-lez",
		avatar: pierre,
		blocked_users: [],
		friend_users: ["nguiard", "clmurphy", "adben-mc"],
		channels: [],
		connected: true,
		in_game: false,
		game_id: -1,
		last_games: [],
	}

	return [u_adam, u_clodagh, u_nathan, u_pierre];
}

export default User;
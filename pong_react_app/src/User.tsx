import React from "react";

import adam from './media/adben-mc.jpg'
import pierre from './media/ple-lez.jpg'
import clodagh from './media/clmurphy.jpg'
import nathan from './media/nguiard.jpg'
import { truncate } from "fs/promises";

export type User_last_game = {
	has_won: boolean,
	opponnent: User | number,
	score: [number, number],
}

export type User = {
	id: number
	name: string,
	avatar: string,
	blocked_users: number[],
	friend_users: number[],
	channels: string[],
	connected: boolean,
	in_game: boolean,
	game_id: number
	// statistics: ?
	last_games: User_last_game[],
}

export function avatarOf(every_users: User[], target: number): string {
	return (typeof(every_users.find(usr => usr.id == target)?.avatar) == 'string' ?
			every_users.find(usr => usr.id == target)?.avatar as string :
			'./media/default.jpg')
}

export function error_user(): User {
	return (
		{
			id: -1,
			name: "#########ERROR########",
			avatar: "",
			blocked_users: [],
			friend_users: [],
			connected: false,
			game_id: -1,
			channels: [],
			in_game: false,
			last_games: []
		}
	)
}

export function id_to_user(every_users: User[], target: number): User {
	return (typeof(every_users.find(usr => usr.id == target)?.id) == 'string' ?
			every_users.find(usr => usr.id == target) as User : error_user())
}

export function sample_user_data(): User[] {
	let u_adam: User = {
		id: 1,
		name: "adben-mc",
		avatar: adam,
		blocked_users: [2],
		friend_users: [4],
		channels: ["Transcendence", "Illuminatis"],
		connected: false,
		in_game: false,
		game_id: -1,
		last_games: [
			{
				has_won: true,
				opponnent: 2,
				score: [10, 6],
			},
			{
				has_won: true,
				opponnent: 3,
				score: [10, 4],
			},
		]
	}

	let u_clodagh: User = {
		id: 2,
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
				opponnent: 3,
				score: [0, 10],
			},
		]
	}

	let u_nathan: User = {
		id: 3,
		name: "nguiard",
		avatar: nathan,
		blocked_users: [1],
		friend_users: [4, 2],
		channels: ["Illuminatis"],
		connected: true,
		in_game: true,
		game_id: 2,
		last_games: [
			{
				has_won: true,
				opponnent: 2,
				score: [10, 0],
			},
			{
				has_won: false,
				opponnent: 1,
				score: [4, 10],
			},
		]
	}

	let u_pierre: User = {
		id: 4,
		name: "ple-lez",
		avatar: pierre,
		blocked_users: [],
		friend_users: [1, 2, 3],
		channels: [],
		connected: true,
		in_game: false,
		game_id: -1,
		last_games: [],
	}

	return [u_adam, u_clodagh, u_nathan, u_pierre];
}

export default User;
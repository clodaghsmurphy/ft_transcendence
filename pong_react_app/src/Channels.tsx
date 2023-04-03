export const NORMAL = 0
export const KICK = 1
export const BAN = 2
export const MUTE = 3
export const INVITE = 4

export interface MessageData {
	text: string,
	uid: number,
	id: number,
	sender_id: number,
	type: number,
	from: string,
} 

export type Channel = {
	name: string,
	members: number[],
	operators: number[],
	banned: number[],
	messages: MessageData[],
	curr_uid: number,
	password: boolean,
	owner: number,
}

export function basic_channel(): Channel {
	return (
		{
			name: "DO NOT USE THIS",
			members: [],
			operators: [],
			banned: [],
			messages: [],
			curr_uid: 0,
			password: false,
			owner: -1,
		}
	)
}

export function sample_channel_data(): Channel[] {
	let chan_1: Channel = {
		name: "Transcendence",
		owner: 2,
		members: [1, 2, 3, 4],
		operators: [1, 2, 3, 4],
		banned: [],
		messages: [{
				sender_id: 2,
				text: "Je pars au ski",
				type: NORMAL,
				id: 0,
				uid: 0,
				from: "Transcendence"
			},
			{
				sender_id: 1,
				text: "Moi aussi",
				type: NORMAL,
				id: 0,
				uid: 1,
				from: "Transcendence"
			},
			{
				sender_id: 4,
				text: "Pas nous",
				type: NORMAL,
				id: 0,
				uid: 2,
				from: "Transcendence"
			},
			{
				sender_id: 3,
				text: "Ouais...",
				type: NORMAL,
				id: 0,
				uid: 3,
				from: "Transcendence"
			},
		],
		curr_uid: 3,
		password: false,
	}
	let chan_2: Channel = {
		name: "Raclette",
		owner: 3,
		members: [3, 4, 1],
		operators: [3],
		banned: [2],
		messages: [{
			sender_id: 3,
			text: "Raclette?",
			type: NORMAL,
			id: 0,
			uid: 0,
			from: "Raclette"
		},
		{
			sender_id: 2,
			text: "Je peux venir?",
			type: NORMAL,
			uid: 1,
			id: 1,
			from: "Raclette"
		},
		{
			sender_id: 4,
			text: "non",
			type: NORMAL,
			id: 1,
			uid: 2,
			from: "Raclette"
		},
		{
			sender_id: 3,
			text: " has banned clmurphy",
			type: BAN,
			id: 1,
			uid: 3,
			from: "Raclette"
		},
		],
		password: false,
		curr_uid: 3,
	}
	let chan_3: Channel = {
		owner: 2,
		name: "Illuminatis",
		members: [1, 2],
		operators: [1, 2],
		banned: [ 3, 4],
		messages: [{
			sender_id: 2,
			text: " has banned nguiard",
			type: BAN,
			id: 1,
			uid: 0,
			from: "Illuminatis"
		},
		{
			sender_id: 2,
			text: " has kicked ple-lez",
			type: KICK,
			id: 1,
			uid: 1,
			from: "Illuminatis"
		},
		{
			sender_id: 2,
			text: "ils ont ose me ban d'une raclette",
			type: NORMAL,
			id: 1,
			uid: 2,
			from: "Illuminatis"
		},
		{
			sender_id: 1,
			text: "On vas conquerir le monde",
			type: NORMAL,
			id: 1,
			uid: 3,
			from: "Illuminatis"
		},
		{
			sender_id: 2,
			text: "/game/6",
			type: INVITE,
			id: 1,
			uid: 4,
			from: "Illuminatis"
		},],
		password: false,
		curr_uid: 3,
	}
	return [chan_1, chan_2, chan_3]
}

export function names_to_channel(every_channels: Channel[], asked_channels: string[]): Channel[] {
	if (typeof asked_channels === 'undefined' || typeof every_channels[0] === 'undefined')
		return [];
	return every_channels.filter(chan => asked_channels.includes(chan.name))
}
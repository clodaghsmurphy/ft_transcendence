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
	is_public: boolean,
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
			is_public: false,
		}
	)
}

export function names_to_channel(every_channels: Channel[], asked_channels: string[]): Channel[] {
	if (typeof asked_channels === 'undefined' || typeof every_channels[0] === 'undefined')
		return [];
	return every_channels.filter(chan => asked_channels.includes(chan.name))
}
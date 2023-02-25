import React from 'react'
import User from './User'

interface MessageData {
	PhotoUrl: string;
	text: string;
	uid: number;
	name: string;
} 

type Channel = {
	name: string,
	members: string[],
	op: string[],
	banned: string[],
	messages: MessageData[],
	curr_uid: number,
}

export function createChannel(c_name: string, creator: User): [Channel, boolean] {
	const new_chan = {
		name: c_name,
		members: [creator.name],
		op: [creator.name],
		banned: [],
		messages: [],
		curr_uid: 0,
	}
	// post le chan
	return	[new_chan, true]
}

export function banFromChan(chan: Channel, current: User, target: string): boolean {
	if (chan.op.includes(current.name)) {
		if (chan.op.includes(target)) {
			return false
		}
		let index = chan.members.indexOf(target)
		if (index > -1) {
			chan.members.splice(index, 1)
		}
		return true
	}
}
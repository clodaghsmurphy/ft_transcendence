import React from 'react'
import User from './User'

export const NORMAL = 0
export const KICK = 1
export const BAN = 2
export const INVITE = 3

interface MessageData {
	text: string;
	uid: number;
	name: string;
	type: number,
} 

export type Channel = {
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
			chan.banned.push(target)
		}
		// post le bannissement
		return true
	}
	return false
}

export function kickFromChan(chan: Channel, current: User, target: string): boolean {
	if (chan.op.includes(current.name)) {
		if (chan.op.includes(target)) {
			return false
		}
		let index = chan.members.indexOf(target)
		if (index > -1) {
			chan.members.splice(index, 1)
		}
		// post le kick
		return true
	}
	return false
}

export function giveOperator(chan: Channel, current: User, target: string): boolean {
	if (chan.op.includes(current.name)) {
		if (chan.op.includes(target)) {
			return true
		}
		chan.op.push(target)
		// post le op
		return true
	}
	return false
}

function sendMessage(chan: Channel, current: User, msg: MessageData): boolean {
	if (chan.members.includes(current.name) && !(chan.banned.includes(current.name))) {
		chan.messages = [
			{
				...msg,
				uid: chan.curr_uid,
			},
			...chan.messages,
		]
		chan.curr_uid += 1
		// post le nv message
		return true
	}
	return false
}

export function sendToChan(chan: Channel, current: User, msg: "string"): boolean {
	const new_message: MessageData = {
		name: current.name,
		uid: 0,
		text: msg,
		type: NORMAL,
	}
	return sendMessage(chan, current, new_message)
}
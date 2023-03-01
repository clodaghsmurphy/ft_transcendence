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
	from: string
} 

export type Channel = {
	name: string,
	members: string[],
	op: string[],
	banned: string[],
	messages: MessageData[],
	curr_uid: number,
}

export function basic_channel(): Channel {
	return (
		{
			name: "DO NOT USE THIS",
			members: [],
			op: [],
			banned: [],
			messages: [],
			curr_uid: 0,
		}
	)
}

export function sample_channel_data(): Channel[] {
	let chan_1: Channel = {
		name: "Transcendence",
		members: ["adben-mc", "clmurphy", "nguiard", "ple-lez"],
		op: ["adben-mc", "clmurphy", "nguiard", "ple-lez"],
		banned: [],
		messages: [{
				name: "clmurphy",
				text: "Je pars au ski",
				type: NORMAL,
				uid: 0,
				from: "Transcendence"
			},
			{
				name: "adben-mc",
				text: "Moi aussi",
				type: NORMAL,
				uid: 1,
				from: "Transcendence"
			},
			{
				name: "ple-lez",
				text: "Pas nous",
				type: NORMAL,
				uid: 2,
				from: "Transcendence"
			},
			{
				name: "nguiard",
				text: "Ouais...",
				type: NORMAL,
				uid: 3,
				from: "Transcendence"
			},
		],
		curr_uid: 3,
	}
	let chan_2: Channel = {
		name: "Raclette",
		members: ["nguiard", "ple-lez", "adben-mc"],
		op: ["nguiard"],
		banned: ["clmurphy"],
		messages: [{
			name: "nguiard",
			text: "Raclette?",
			type: NORMAL,
			uid: 0,
			from: "Raclette"
		},
		{
			name: "clmurphy",
			text: "Je peux venir?",
			type: NORMAL,
			uid: 1,
			from: "Raclette"
		},
		{
			name: "ple-lez",
			text: "non",
			type: NORMAL,
			uid: 2,
			from: "Raclette"
		},
		{
			name: "nguiard",
			text: " has banned clmurphy",
			type: BAN,
			uid: 3,
			from: "Raclette"
		},
		],
		curr_uid: 3,
	}
	let chan_3: Channel = {
		name: "Illuminatis",
		members: ["adben-mc", "clmurphy"],
		op: ["adben-mc", "clmurphy"],
		banned: [ "nguiard", "ple-lez"],
		messages: [{
			name: "clmurphy",
			text: " has banned nguiard",
			type: BAN,
			uid: 0,
			from: "Illuminatis"
		},
		{
			name: "clmurphy",
			text: " has banned ple-lez",
			type: BAN,
			uid: 1,
			from: "Illuminatis"
		},
		{
			name: "clmurphy",
			text: "ils ont ose me ban d'une raclette",
			type: NORMAL,
			uid: 2,
			from: "Illuminatis"
		},
		{
			name: "adben-mc",
			text: "On vas conquerir le monde",
			type: NORMAL,
			uid: 3,
			from: "Illuminatis"
		},],
		curr_uid: 3,
	}
	return [chan_1, chan_2, chan_3]
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
		from: chan.name,
	}
	return sendMessage(chan, current, new_message)
}
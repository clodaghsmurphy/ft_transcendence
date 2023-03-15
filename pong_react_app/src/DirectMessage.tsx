import React from 'react'
import { MessageData, NORMAL } from './Channels'
import User from './User'

export type DirectMessage = {
	users: number[], // Tableau avec les id des deux participants
	messages: MessageData[],
}

export function sample_DM_data(): DirectMessage[] {
	let dm_adam_clodagh: DirectMessage = {
		users: [1, 2],
		messages: [{
			from: 'DirectMessage',
			sender_id: 2,
			sender_name: 'clmurphy',
			text: 'Je suis partie au ski tu viens?',
			type: NORMAL,
			uid: 0,
		}, {
			from: 'DirectMessage',
			sender_id: 1,
			sender_name: 'adben-mc',
			text: 'Non je suis deja partit la semaine derniere :/',
			type: NORMAL,
			uid: 1,
		}, {
			from: 'DirectMessage',
			sender_id: 2,
			sender_name: 'clmurphy',
			text: 'Ah oui merde... La prochaine fois!',
			type: NORMAL,
			uid: 2,
		}
	]}

	let dm_adam_nathan: DirectMessage = {
		users: [1, 3],
		messages: [{
			from: 'DirectMessage',
			sender_id: 3,
			sender_name: 'nguiard',
			text: 'Je suis un oiseau bleu',
			type: NORMAL,
			uid: 0,
		}, {
			from: 'DirectMessage',
			sender_id: 1,
			sender_name: 'adben-mc',
			text: 'qu\'est ce que tu dis?',
			type: NORMAL,
			uid: 1,
		}, {
			from: 'DirectMessage',
			sender_id: 3,
			sender_name: 'nguiard',
			text: 'cui cui',
			type: NORMAL,
			uid: 2,
		}
	]}

	let dm_adam_pierre: DirectMessage = {
		users: [1, 4],
		messages: [{
			from: 'DirectMessage',
			sender_id: 1,
			sender_name: 'adben-mc',
			text: 'Je crois que nathan deviens fou',
			type: NORMAL,
			uid: 0,
		}, {
			from: 'DirectMessage',
			sender_id: 4,
			sender_name: 'ple-lez',
			text: 'ah bon?',
			type: NORMAL,
			uid: 1,
		}, {
			from: 'DirectMessage',
			sender_id: 1,
			sender_name: 'adben-mc',
			text: 'Il fais des bruis d\'oiseau en dm',
			type: NORMAL,
			uid: 2,
		}, {
			from: 'DirectMessage',
			sender_id: 4,
			sender_name: 'ple-lez',
			text: 'wtf je vais voir ca',
			type: NORMAL,
			uid: 3,
		}
	]}

	let dm_clodagh_nathan: DirectMessage = {
		users: [1, 4],
		messages: [{
			from: 'DirectMessage',
			sender_id: 2,
			sender_name: 'clmurphy',
			text: 'Fais tes attaques de GDC',
			type: NORMAL,
			uid: 0,
		}, {
			from: 'DirectMessage',
			sender_id: 3,
			sender_name: 'nguiard',
			text: 'cui cui cui',
			type: NORMAL,
			uid: 1,
		}, {
			from: 'DirectMessage',
			sender_id: 2,
			sender_name: 'clmurphy',
			text: '???',
			type: NORMAL,
			uid: 2,
		}, {
			from: 'DirectMessage',
			sender_id: 3,
			sender_name: 'nguiard',
			text: 'cui',
			type: NORMAL,
			uid: 3,
		}, {
			from: 'DirectMessage',
			sender_id: 3,
			sender_name: 'nguiard',
			text: 'cui cui cui',
			type: NORMAL,
			uid: 4,
		}
	]}

	let dm_nathan_pierre: DirectMessage = {
		users: [1, 4],
		messages: [{
			from: 'DirectMessage',
			sender_id: 4,
			sender_name: 'ple-lez',
			text: 'Ca va nathan?',
			type: NORMAL,
			uid: 0,
		}, {
			from: 'DirectMessage',
			sender_id: 3,
			sender_name: 'nguiard',
			text: 'cui cui cui! cui cui...',
			type: NORMAL,
			uid: 1,
		}, {
			from: 'DirectMessage',
			sender_id: 4,
			sender_name: 'ple-lez',
			text: 'heuuu...',
			type: NORMAL,
			uid: 2,
		}, {
			from: 'DirectMessage',
			sender_id: 3,
			sender_name: 'nguiard',
			text: 'cui >:(',
			type: NORMAL,
			uid: 3,
		},
	]}

	let dm_nathan_nathan: DirectMessage = {
		users: [94596, 3],
		messages: [{
			from: 'DirectMessage',
			sender_id: 94596,
			sender_name: 'nguiard',
			text: 'test',
			type: NORMAL,
			uid: 0,
		}, {
			from: 'DirectMessage',
			sender_id: 3,
			sender_name: 'nguiard',
			text: 'test2',
			type: NORMAL,
			uid: 1,
		}, {
			from: 'DirectMessage',
			sender_id: 94596,
			sender_name: 'nguiard',
			text: 'tututut',
			type: NORMAL,
			uid: 2,
		}, {
			from: 'DirectMessage',
			sender_id: 3,
			sender_name: 'nguiard',
			text: 'YASGDUASDYH',
			type: NORMAL,
			uid: 3,
		},
	]}

	return [dm_adam_clodagh, dm_adam_nathan,
		dm_adam_pierre, dm_clodagh_nathan, dm_nathan_pierre, dm_nathan_nathan];
}

export function dm_of_user(user: User): DirectMessage[] {
	return(sample_DM_data().filter((dm) => dm.users.includes(user.id)));
}

export function dm_betweeen_two_users(usr1: User, usr2: User): DirectMessage {
	return(sample_DM_data().find((dm) =>
		dm.users.includes(usr1.id) && dm.users.includes(usr2.id)
	) as DirectMessage)
}

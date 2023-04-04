import React from 'react'
import { MessageData, NORMAL } from './Channels'
import User from '../../User'

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
			text: 'Je suis partie au ski tu viens?',
			type: NORMAL,
			id: 1,
			uid: 0,
		}, {
			from: 'DirectMessage',
			sender_id: 1,
			text: 'Non je suis deja partit la semaine derniere :/',
			type: NORMAL,
			id: 1,
			uid: 1,
		}, {
			from: 'DirectMessage',
			sender_id: 2,
			text: 'Ah oui merde... La prochaine fois!',
			type: NORMAL,
			id: 1,
			uid: 2,
		}
	]}

	let dm_adam_nathan: DirectMessage = {
		users: [1, 3],
		messages: [{
			from: 'DirectMessage',
			sender_id: 3,
			text: 'Je suis un oiseau bleu',
			type: NORMAL,
			id: 1,
			uid: 0,
		}, {
			from: 'DirectMessage',
			sender_id: 1,
			text: 'qu\'est ce que tu dis?',
			type: NORMAL,
			id: 1,
			uid: 1,
		}, {
			from: 'DirectMessage',
			sender_id: 3,
			text: 'cui cui',
			type: NORMAL,
			id: 1,
			uid: 2,
		}
	]}

	let dm_adam_pierre: DirectMessage = {
		users: [1, 4],
		messages: [{
			from: 'DirectMessage',
			sender_id: 1,
			text: 'Je crois que nathan deviens fou',
			type: NORMAL,
			id: 1,
			uid: 0,
		}, {
			from: 'DirectMessage',
			sender_id: 4,
			text: 'ah bon?',
			type: NORMAL,
			id: 1,
			uid: 1,
		}, {
			from: 'DirectMessage',
			sender_id: 1,
			text: 'Il fais des bruis d\'oiseau en dm',
			type: NORMAL,
			id: 1,
			uid: 2,
		}, {
			from: 'DirectMessage',
			sender_id: 4,
			text: 'wtf je vais voir ca',
			type: NORMAL,
			id: 1,
			uid: 3,
		}
	]}

	let dm_clodagh_nathan: DirectMessage = {
		users: [1, 4],
		messages: [{
			from: 'DirectMessage',
			sender_id: 2,
			text: 'Fais tes attaques de GDC',
			type: NORMAL,
			id: 1,
			uid: 0,
		}, {
			from: 'DirectMessage',
			sender_id: 3,
			text: 'cui cui cui',
			type: NORMAL,
			id: 1,
			uid: 1,
		}, {
			from: 'DirectMessage',
			sender_id: 2,
			text: '???',
			type: NORMAL,
			id: 1,
			uid: 2,
		}, {
			from: 'DirectMessage',
			sender_id: 3,
			text: 'cui',
			type: NORMAL,
			id: 1,
			uid: 3,
		}, {
			from: 'DirectMessage',
			sender_id: 3,
			text: 'cui cui cui',
			type: NORMAL,
			id: 1,
			uid: 4,
		}
	]}

	let dm_nathan_pierre: DirectMessage = {
		users: [1, 4],
		messages: [{
			from: 'DirectMessage',
			sender_id: 4,
			text: 'Ca va nathan?',
			type: NORMAL,
			id: 1,
			uid: 0,
		}, {
			from: 'DirectMessage',
			sender_id: 3,
			text: 'cui cui cui! cui cui...',
			type: NORMAL,
			id: 1,
			uid: 1,
		}, {
			from: 'DirectMessage',
			sender_id: 4,
			text: 'heuuu...',
			type: NORMAL,
			id: 1,
			uid: 2,
		}, {
			from: 'DirectMessage',
			sender_id: 3,
			text: 'cui >:(',
			type: NORMAL,
			id: 1,
			uid: 3,
		},
	]}

	let dm_nathan_nathan: DirectMessage = {
		users: [94596, 3],
		messages: [{
			from: 'DirectMessage',
			sender_id: 94596,
			text: 'test',
			type: NORMAL,
			id: 1,
			uid: 0,
		}, {
			from: 'DirectMessage',
			sender_id: 3,
			text: 'test2',
			type: NORMAL,
			uid: 1,
			id: 1,
		}, {
			from: 'DirectMessage',
			sender_id: 94596,
			text: 'tututut',
			type: NORMAL,
			id: 1,
			uid: 2,
		}, {
			from: 'DirectMessage',
			sender_id: 3,
			text: 'YASGDUASDYH',
			type: NORMAL,
			id: 1,
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

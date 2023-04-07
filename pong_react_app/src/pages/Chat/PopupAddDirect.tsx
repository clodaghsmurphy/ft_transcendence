import React from 'react'
import Popup from 'reactjs-popup'
import { add_dm } from './ChatUtils'
import User from '../utils/User'
import { DirectMessage } from './DirectMessage'
import { Channel, MessageData } from './Channels'
import axios, { AxiosResponse, AxiosError } from 'axios'

const { v4: uuidv4 } = require('uuid');

export default function PopupAddDirect(every_users: User[], current_user: User,
	change_dm: (c: Channel | DirectMessage) => void, dms: DirectMessage[],
	set_dms: React.Dispatch<React.SetStateAction<DirectMessage[]>>) {
	if (typeof current_user === 'undefined')
		return <div key={uuidv4()}></div>

	function create_dm(usr: User) {
		let msg: MessageData[] = []

		console.log('test')

		if (typeof dms.find(
				(dm: DirectMessage) => dm.id === usr.id
			) === 'undefined') {

			axios.get('/api/dm/' + usr.id)
				.then((response: AxiosResponse) => {
					console.log(response.data)
					msg = response.data
				})
			
			set_dms([...dms, {
				id: usr.id,
				msg: msg,
			}])
		}
		change_dm({
			id: usr.id,
			msg: msg,
		})
	}

	function basic_users(every_user: User[]): JSX.Element[] {
		let ret: JSX.Element[] = []

		for (const user of every_user) {
			ret.push(
				<button className='popup-user-dm' key={uuidv4()}
					onClick={() => create_dm(user)}>
					<img src={user.avatar} alt={user.name} />
					<div>{user.name}</div>
				</button>
			)
		}
		return ret;
	}

	return (
		<Popup trigger={add_dm()} modal nested key={uuidv4()}>
			<h1>User list:</h1>
			<div className='popup-user-container'>
				{basic_users(every_users.filter(usr => 
					usr.name !== current_user.name && dms.every(
						(dm: DirectMessage) => dm.id !== usr.id
					)
				))}
			</div>
		</Popup>
	)
}
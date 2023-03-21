import React, { useState, useRef } from 'react'
import Popup from 'reactjs-popup'
import { add_dm } from './Chat'
import User from './User'
import Checkbox from '@mui/material/Checkbox'
import { Channel, MessageData } from './Channels'

const { v4: uuidv4 } = require('uuid');

export default function PopupAddDirect(every_users: User[], current_user: User) {
	if (typeof current_user === 'undefined')
		return <div key={uuidv4()}></div>

	function create_dm(usr: User) {
		console.log("tried to dm", usr.id);
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
				{basic_users(every_users.filter(usr => usr.name != current_user.name))}
			</div>
		</Popup>
	)
}
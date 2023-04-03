import React, { useState, useRef } from 'react'
import Popup from 'reactjs-popup'
import { add_group, sanitizeString } from './ChatUtils'
import { socket_chat } from './Chat'
import User from './User'

const { v4: uuidv4 } = require('uuid');

export default function PopupJoinChannel(every_users: User[], current_user: User) {
	let [selected, setSelected] = useState([] as number[]);
	let privateRef = useRef<HTMLInputElement | null>(null);
	let inputRef = useRef<HTMLInputElement | null>(null);
	let inputRefPassword = useRef<HTMLInputElement | null>(null);
	if (typeof current_user === 'undefined')
		return <div key={uuidv4()}></div>
	else if (!selected.includes(current_user.id)){
		let tmp = selected
		tmp.push(current_user.id)
		setSelected(tmp);
	}

	function clickCheckbox(id: number) {
		if (selected.includes(id))
			selected.splice(selected.indexOf(id), 1);
		else
		{
			let tmp = selected;
			tmp.push(id);
			setSelected(tmp);
		}
	}

	function basic_users(every_user: User[]): JSX.Element[] {
		let ret: JSX.Element[] = []

		for (const user of every_user) {
			ret.push(
				<div className='popup-user' key={uuidv4()}>
					<img src={user.avatar} alt={user.name} />
					<div>{user.name}</div>
					<input type="checkbox" style={{
						display: 'flex',
						flex: '0 0 42px',
					}} onChange={() => clickCheckbox(user.id)}
					className='hover-cursor'/>
				</div>
			)
		}
		return ret;
	}

	return (
		<Popup trigger={join_group()} modal nested key={uuidv4()}>
			<h1>Join channels:</h1>
		</Popup>
	)
}

function join_group() {
	return (
		<button className='join-channel-button'>
			Test !!!! 
		</button>
	)
}
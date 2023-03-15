import React, { useState, useRef } from 'react'
import Popup from 'reactjs-popup'
import { add_group } from './Chat'
import User from './User'
import Checkbox from '@mui/material/Checkbox'
import { Channel, MessageData } from './Channels'

const { v4: uuidv4 } = require('uuid');

export default function PopupAddChannel(every_users: User[], current_user: User) {
	let [selected, setSelected] = useState([] as number[]);
	let inputRef = useRef<HTMLInputElement | null>(null);
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
					}} onChange={() => clickCheckbox(user.id)}/>
				</div>
			)
		}
		return ret;
	}

	function ValidateChan() {
		if (!inputRef.current || inputRef.current.value == '')
			return ;
		const chan_name = inputRef.current!.value;
		inputRef.current!.value = '';
		setSelected([current_user.id]);
		fetch('/api/channel/create', {
			method: 'POST',
			body: JSON.stringify({
				name: chan_name,
				user_id: current_user.id,
			}),
			headers: {'Content-Type': 'application/json'},
		})
		.then(response => {
			response.json()
				.then(data => {
					if (typeof data.status === 'undefined') {
						for (const usr of selected) {
							if (usr === current_user.id || typeof usr === 'undefined')
								continue;
							console.log("Adding", usr)
							fetch('/api/channel/join', {
								method: 'POST',
								body: JSON.stringify({
									name: chan_name,
									user_id: usr,
								}),
								headers: {'Content-Type': 'application/json'},
							})
						}
					}
				})
		})
	}

	return (
		<Popup trigger={add_group()} modal nested key={uuidv4()}>
			<h1>Add users:</h1>
			<div className='popup-user-container'>
				{basic_users(every_users.filter(usr => usr.name != current_user.name))}
			</div>
			
			<div className='bar' style={{
				width: '90%',
				marginLeft: '5%',
				marginBottom: '10px',
				marginTop: 'auto'
			}}></div>

			<div className='popup-prompt'>
				<input ref={inputRef} type='text'></input>
				<button onClick={() => ValidateChan()}>Create</button>
			</div>
		</Popup>
	)
}
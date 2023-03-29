import React, { useState, useRef } from 'react'
import Popup from 'reactjs-popup'
import { add_group } from './ChatUtils'
import { socket_chat } from './Chat'
import User from './User'
import Checkbox from '@mui/material/Checkbox'
import { Channel, MessageData } from './Channels'

const { v4: uuidv4 } = require('uuid');

export default function PopupAddChannel(every_users: User[], current_user: User) {
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

	function ValidateChan() {
		if (!inputRef.current || inputRef.current.value == '')
			return ;
		const chan_name = inputRef.current!.value;
		const chan_pass = inputRefPassword.current!.value;
		inputRef.current!.value = '';
		inputRefPassword.current!.value = '';
		setSelected([current_user.id]);
		let tmp = selected.filter(usr => typeof usr === 'number' && usr != current_user.id)
		fetch('/api/channel/create', {
			method: 'POST',
			body: ( chan_pass.length > 0 ?
				JSON.stringify({
					name: chan_name,
					owner_id: current_user.id,
					users_ids: tmp,
				}) :
				JSON.stringify({
					name: chan_name,
					owner_id: current_user.id,
					users_ids: tmp,
					pass: chan_pass,
				})),
				headers: {'Content-Type': 'application/json'},
			})
			.then(response => {
				console.log('response fetch')
				response.json()
					.then(data => {
						console.log('data fetch')
						socket_chat.emit('join', {
							name: chan_name,
							user_id: current_user.id,
						})
					})
			})
		}

	return (
		<Popup trigger={add_group()} modal nested key={uuidv4()}>
			<h1>Add users:</h1>
			<div className='popup-user-container'>
				{basic_users(every_users.filter(usr => 
						usr.name != current_user.name))}
			</div>
			
			<div className='bar' style={{
				width: '90%',
				marginLeft: '5%',
				marginBottom: '10px',
				marginTop: 'auto'
			}}></div>

			<div className='popup-prompt'>
				<input ref={inputRef} type='text' placeholder='Name'></input>
				<button onClick={() => ValidateChan()}
				className='hover-cursor'>Create</button>
			</div>
			<div className='popup-prompt'>
				<input ref={inputRefPassword} type='password'
				placeholder='Password'></input>
				<div className='private-setter'>
					Private:
					<input type='checkbox'
						ref={privateRef}
						style={{
							alignSelf: 'flex-end'
						}}
					></input>
				</div>
			</div>
		</Popup>
	)
}
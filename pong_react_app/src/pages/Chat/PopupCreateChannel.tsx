import React, { useState, useRef } from 'react'
import Popup from 'reactjs-popup'
import { add_group, sanitizeString } from './ChatUtils'
import { socket_chat } from './Chat'
import User from '../utils/User'
import axios, { AxiosResponse, AxiosError } from 'axios'


const { v4: uuidv4 } = require('uuid');

type ChanPost = {
	name: string,
	owner_id: number,
	users_ids: number[],
	is_public: boolean,
	password?: string,
}

export default function PopupCreateChannel(every_users: User[], current_user: User) {
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
		if (!inputRef.current || inputRef.current.value === '')
			return ;
		const chan_name = sanitizeString(inputRef.current!.value);
		const chan_pass = inputRefPassword.current!.value;
		inputRef.current!.value = '';
		inputRefPassword.current!.value = '';
		setSelected([current_user.id]);
		let tmp = selected.filter(usr => typeof usr === 'number' && usr !== current_user.id)
		let body: ChanPost = {
			name: chan_name,
			owner_id: current_user.id,
			users_ids: tmp,
			is_public: !privateRef.current!.checked,
		}
		if (chan_pass?.length > 0) {
			console.log('inside the chan_pass if')
			body = {
				...body,
				password: chan_pass
			}
		}

		const headers = {'Content-Type': 'application/json'}
		axios.post('/api/channel/create', body, { headers })
			.then((response: AxiosResponse) => {
				socket_chat.emit('join', {
					name: chan_name,
					user_id: current_user.id,
				}, (data: any) => {
					console.log('return of emit join:', data)
				})
			})
		}

	let b_users: JSX.Element[] = []
	if (every_users.length !== 0)
		b_users = basic_users(every_users.filter(
			usr => usr.name !== current_user.name
		))
	
	return (
		<Popup trigger={add_group()} modal nested key={uuidv4()}>
			<h1>Add users:</h1>
			<div className='popup-user-container'>
				{b_users}
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
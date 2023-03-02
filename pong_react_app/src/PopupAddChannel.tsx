import React, { useState, useRef } from 'react'
import Popup from 'reactjs-popup'
import { add_group } from './Chat'
import User from './User'
import Checkbox from '@mui/material/Checkbox'
import { Channel } from './Channels'

const { v4: uuidv4 } = require('uuid');


export default function PopupAddChannel(every_users: User[], current_user: User) {
	let base = ''
	if (typeof current_user !== 'undefined')
		base = current_user.name
	let [selected, setSelected] = useState([base]);
	let inputRef = useRef<HTMLInputElement | null>(null);
	if (typeof current_user === 'undefined')
		return <div key={uuidv4()}></div>
	else if (selected.includes('') && !selected.includes(current_user.name)){
		let tmp = selected
		tmp.splice(tmp.indexOf(''), 1);
		tmp.push(current_user.name)
		setSelected(tmp);
	}

	function clickCheckbox(name: string) {
		if (selected.includes(name))
			selected.splice(selected.indexOf(name), 1);
		else
		{
			let tmp = selected;
			tmp.push(name);
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
					<Checkbox sx={{
						display: 'flex',
						flex: '0 0 42px',
					}} onClick={() => clickCheckbox(user.name)}/>
				</div>
			)
		}
		return ret;
	}

	function ValidateChan() {
		if (!inputRef.current || inputRef.current.value == '')
			return ;
		let chan: Channel = {
			name: inputRef.current!.value,
			members: selected,
			op: [current_user.name],
			banned: [],
			messages: [],
			curr_uid: 0,
		}
		console.log(chan.members);
		inputRef.current!.value = ''
	}

	return (
		<Popup trigger={add_group()} modal nested key={uuidv4()}>
			<h1>Add users:</h1>
			<div className='popup-user-container'>
				{basic_users(every_users.filter(usr => usr.name != current_user.name))}
			</div>
			<div className='popup-prompt'>
				<input ref={inputRef} type='text'></input>
				<button onClick={() => ValidateChan()}>Create</button>
			</div>
		</Popup>
	)
}


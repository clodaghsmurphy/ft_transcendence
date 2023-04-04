import React, { useState, useRef, useEffect } from 'react'
import Popup from 'reactjs-popup'
import { add_group, sanitizeString } from './ChatUtils'
import { socket_chat } from './Chat'
import User from '../../User'
import { Channel } from './Channels'

const { v4: uuidv4 } = require('uuid');

export default function PopupJoinChannel(chanOfUser: Channel[], current_user: User) {
	let passwordRef = useRef<HTMLInputElement | null>(null)
	let [channels, setChannels] = useState([] as Channel[])

	useEffect(() => {
		fetch('/api/channel/info')
			.then(response => {
				response.json()
					.then(data => {
						let every_chan: Channel[] = data as Channel[]
						
						setChannels(every_chan.filter(c => 
							!c.members.includes(current_user.id) && c.is_public
						))
					})
			})
	}, [current_user, chanOfUser])

	function click_handler(chan: Channel) {
		if (chan.password) {
			if (passwordRef.current?.value.length === 0)
				return;
			fetch('/api/channel/join/', {
				method: 'POST',
				body: JSON.stringify({
					name: chan.name,
					user_id: current_user.id,
					password: passwordRef.current?.value,
				}),
				headers: {'Content-Type': 'application/json'},
			})
				.then(response => {
					response.json()
						.then(data => 
							console.log(data)
						)
						.catch(err =>
							console.error(err)
						)
				})
		}
		else {
			fetch('/api/channel/join/', {
				method: 'POST',
				body: JSON.stringify({
					name: chan.name,
					user_id: current_user.id,
				}),
				headers: {'Content-Type': 'application/json'},
			})
				.then(response => {
					response.json()
						.then(data => 
							console.log(data)
						)
						.catch(err =>
							console.error(err)
						)
				})
		}
	}

	let jsx_chans: JSX.Element[] = []

	for (const channel of channels) {
		if (channel.password)
			jsx_chans.push(
				<div key={uuidv4()}
					onClick={() => click_handler(channel)}
					className='join-channel-password'>
					<h1>{channel.name}</h1>
					PASSWORD CHAN
				</div>);
		else
			jsx_chans.push(
				<div key={uuidv4()}
					onClick={() => click_handler(channel)}
					className='join-channel-normal'>
					<h1>{channel.name}</h1>
				</div>);
	}

	return (
		<Popup trigger={join_group()} modal nested key={uuidv4()}>
			<h1>Join channels:</h1>
			<div className='popup-user-container'>
				{jsx_chans}
			</div>

			<div className='popup-prompt'>
				<input ref={passwordRef} type='password'
				placeholder='Password'></input>
			</div>
		</Popup>
	)
}

function join_group() {
	return (
		<button className='join-channel-button'>
			Join
		</button>
	)
}
import React, { useState, useRef, useEffect } from 'react'
import Popup from 'reactjs-popup'
import { socket_chat } from './Chat'
import User from '../utils/User'
import { Channel } from './Channels'
import { DirectMessage } from './DirectMessage'
import axios, { AxiosResponse, AxiosError } from 'axios'

const { v4: uuidv4 } = require('uuid');

export default function PopupJoinChannel(chanOfUser: Channel[], current_user: User,
	changeChannelOrDm: (param: Channel | DirectMessage) => void,
	setChanOfUser: React.Dispatch<React.SetStateAction<Channel[]>>)
{
	let passwordRef = useRef<HTMLInputElement | null>(null)
	let [channels, setChannels] = useState([] as Channel[])

	useEffect(() => {
		axios.get('/api/channel/info')
			.then((response: AxiosResponse) => {
				let every_chan: Channel[] = response.data as Channel[]
				
				setChannels(every_chan.filter(c => 
					!c.members.includes(current_user.id) && c.is_public
				))
			})
	}, [current_user, chanOfUser])

	function click_handler(chan: Channel) {
		if (chan.password) {
			if (passwordRef.current?.value.length === 0)
				return;


			axios.post('/api/channel/join/', {
					name: chan.name,
					user_id: current_user.id,
					password: passwordRef.current?.value,
				})
				.then((response: AxiosResponse) => {
						if (typeof response.data.status === 'undefined') {
							changeChannelOrDm(response.data as Channel)
							socket_chat.emit('join', {
								name: response.data.name,
								user_id: current_user.id,
							})
							setChanOfUser((prev: Channel[]) =>
								[...prev, response.data as Channel]
							)
						}
					})
				.catch((err: AxiosError) => err)
		}
		else {
			axios.post('/api/channel/join/', {
					name: chan.name,
					user_id: current_user.id,
				})
				.then((response: AxiosResponse) => {
						changeChannelOrDm(response.data as Channel)
						socket_chat.emit('join', {
							name: response.data.name,
							user_id: current_user.id,
						})
						setChanOfUser((prev: Channel[]) =>
							[...prev, response.data as Channel]
						)
					})
				.catch((err: AxiosError) => err)
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
					<div className='password-indicator'>[password]</div>
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

			<div className='popup-prompt'
				style={{
					marginTop: 'auto',
					marginBottom: '10px',
				}}>
				<input ref={passwordRef} type='password'
				placeholder='Password (if needed)'></input>
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
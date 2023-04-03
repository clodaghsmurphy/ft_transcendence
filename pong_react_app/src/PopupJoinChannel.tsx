import React, { useState, useRef, useEffect } from 'react'
import Popup from 'reactjs-popup'
import { add_group, sanitizeString } from './ChatUtils'
import { socket_chat } from './Chat'
import User from './User'
import { Channel } from './Channels'

const { v4: uuidv4 } = require('uuid');

export default function PopupJoinChannel(chanOfUser: Channel[], current_user: User) {
	let passwordRef = useRef<HTMLInputElement | null>(null)
	let [channels, setChannels] = useState([] as Channel[])
	let [loading, setLoading] = useState(true)

	useEffect(() => {
		fetch('/api/channel/info')
			.then(response => {
				response.json()
					.then(data => {
						let every_chan: Channel[] = data as Channel[]
						
						setChannels(every_chan.filter(c => !c.members.includes(current_user.id)))
						setLoading(false)
					})
			})
	}, [current_user])

	console.log('current_user', current_user)

	console.log(channels.map((c: any) => (c.name)))
	
	let jsx_chans: JSX.Element[] = []

	for (const channel of channels) {
		jsx_chans.push(
			<div key={uuidv4()}>{channel.name}</div>
		)
	}

	return (
		<Popup trigger={join_group()} modal nested key={uuidv4()}>
			<h1>Join channels:</h1>
			{jsx_chans}
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
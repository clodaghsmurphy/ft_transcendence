import React, { useState, useRef } from 'react'
import Popup from 'reactjs-popup'
import { add_group, sanitizeString } from './ChatUtils'
import { socket_chat } from './Chat'
import User from './User'
import { Channel } from './Channels'

const { v4: uuidv4 } = require('uuid');

export default function PopupJoinChannel(chanOfUser: Channel[], current_user: User) {
	let passwordRef = useRef<HTMLInputElement | null>(null)
	let [channel, setChannel] = useState([] as Channel[])

	useEffect(() => {

	}, [])

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
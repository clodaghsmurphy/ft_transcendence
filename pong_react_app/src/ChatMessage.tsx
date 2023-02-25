import React, { ChangeEvent } from 'react'
import './Dashboard.css'
import user_pfp from './media/user.png'
import Messages from './Messages'
import nathan from './media/nguiard.jpg'
import { Avatar } from '@mui/material'
import { useState } from 'react'

const { v4: uuidv4 } = require('uuid');

interface MessageData {
	text: string;
	uid: number;
	name: string;
	type: number;
} 

function ChatMessage(msg: MessageData, avatar: string)
{
	const my_name = "clmurphy";
	const messageClass = msg.name == my_name ? "sender message-wrapper" : "message-wrapper"
	return (
	<div key={uuidv4()}>
		<div className={messageClass} key={uuidv4()}>
			<div className="message-avatar" key={uuidv4()}>
				<img src={avatar} alt={msg.name} key={uuidv4()}
					style={{
						'minWidth': '3rem',
						'minHeight': '3rem',
						'height': '3rem',
						'width': '3rem',
						'marginTop': 'auto',
						'marginBottom': 'auto',
						'aspectRatio': '1 / 1',
						'borderRadius': '50%'
					}}>
				</img>
				<div className="message-header" key={uuidv4()}>
					<span key={uuidv4()}>{msg.name}</span>
				</div>
			</div>
				<div className="message-body" key={uuidv4()}>
					{msg.text}
				</div>
		</div>	
	</div>
	)
}

export default ChatMessage;
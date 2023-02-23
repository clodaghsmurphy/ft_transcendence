import React, { ChangeEvent } from 'react'
import './Dashboard.css'
import user_pfp from './media/user.png'
import Messages from './Messages'
import nathan from './media/nguiard.jpg'
import { Avatar } from '@mui/material'
import { useState } from 'react'

interface MessageData {
	createdAt: Date;
	PhotoUrl: string;
	text: string;
	uid: number;
	name: string;

} 

function ChatMessage(props: { name: string; text: string; uid: number; PhotoUrl: string; })
{
	const messageClass = props.uid === 1 ? "message-wrapper sender" : "message"
	return (
	<>
		<div className={messageClass}>
			<div className="message-avatar">
				<Avatar src={props.PhotoUrl} alt={props.name}
					sx={{
						'width': '3em', 'height': 'auto',
						'aspectRatio': '1 / 1', 'paddingLeft': '0px',
						'paddingRight': '5px'
					}}>
				</Avatar>
			</div>
			<div className={messageClass}>
				<div className="message-header">
					<span>{props.name}</span>

				</div>
				<div className="message-body">
					{props.text}

				</div>
			</div>
		</div>	
		</>
	)
}

export default ChatMessage;
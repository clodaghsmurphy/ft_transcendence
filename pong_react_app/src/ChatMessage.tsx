import React from 'react'
import './Dashboard.css'
import User, { avatarOf, id_to_user } from './User'
import { MessageData, BAN, INVITE, KICK, MUTE } from './Channels'
import { Link } from 'react-router-dom'

const { v4: uuidv4 } = require('uuid');

function ChatMessage(every_user: User[], msg: MessageData, curr_user: User): JSX.Element
{
	let sender_name = id_to_user(every_user, msg.sender_id).name

	if (typeof curr_user === 'undefined')
		return <div key={uuidv4()}/>
	

	if (msg.type === BAN) {
		return (BannedMessage(msg, sender_name))
	}

	if (msg.type === KICK) {
		return (KickMessage(msg, sender_name))
	}

	if (msg.type === MUTE) {
		return (MuteMessage(msg, sender_name))
	}

	// Si le sender a ete ban par le curr_user
	if (msg.type !== BAN && msg.type !== KICK &&
		curr_user.blocked_users.includes(msg.sender_id))
		return <div key={uuidv4()}></div>;
	
	if (msg.type === INVITE) {
		return InviteMessage(every_user, msg, curr_user, sender_name)
	}


	const messageClass = msg.sender_id === curr_user.id ? "sender message-wrapper" : "message-wrapper"
	return (
		<div className={messageClass} key={uuidv4()}>
			<div className="message-avatar" key={uuidv4()}>
				<img src={avatarOf(every_user, msg.sender_id)} alt={sender_name} key={uuidv4()}
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
					<span key={uuidv4()}>{sender_name}</span>
				</div>
			</div>
				<div className="message-body" key={uuidv4()}>
					{msg.text}
				</div>
		</div>	
	)
}

function BannedMessage(msg: MessageData, sender_name: string): JSX.Element {
	let txt = "--- " + sender_name + msg.text + " ---"
	
	return (
		<div className='ban-message' key={uuidv4()}>
			{txt}
		</div>
	)
}

function KickMessage(msg: MessageData, sender_name: string): JSX.Element {
	let txt = "--- " + sender_name + msg.text + " ---"
	
	return (
		<div className='kick-message' key={uuidv4()}>
			{txt}
		</div>
	)
}

function MuteMessage(msg: MessageData, sender_name: string): JSX.Element {
	let txt = "--- " + sender_name + msg.text + " ---"
	
	return (
		<div className='mute-message' key={uuidv4()}>
			{txt}
		</div>
	)
}

function InviteMessage(every_user: User[], msg: MessageData, curr_user: User, sender_name: string) {
	const messageClass = msg.sender_id === curr_user.id ? "sender message-wrapper" : "message-wrapper"

	return (
		<div className={messageClass} key={uuidv4()}>
			<div className="message-avatar" key={uuidv4()}>
				<img src={avatarOf(every_user, msg.sender_id)} alt={sender_name} key={uuidv4()}
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
					<span key={uuidv4()}>{msg.sender_id}</span>
				</div>
			</div>
				<Link to={msg.text} className="message-body-link" key={uuidv4()}
				style={{
				}}>
					<div>{sender_name + " has invited you to join a game! Click on this message to join."}</div>
				</Link>
		</div>	
	)
}

export default ChatMessage;
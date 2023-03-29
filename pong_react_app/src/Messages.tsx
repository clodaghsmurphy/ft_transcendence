import React, { ChangeEvent, useEffect} from 'react'
import './Dashboard.css'
import user_pfp from './media/user.png'
import nathan from './media/nguiard.jpg'
import clodagh from './media/clmurphy.jpg'
import { Avatar } from '@mui/material'
import { useState, useRef } from 'react'
import ChatMessage from './ChatMessage'
import Chat, { ChanAndMessage, socket_chat } from './Chat'
import { MessageData, Channel, NORMAL, BAN, KICK, INVITE } from './Channels'
import User, { avatarOf, id_to_user, sample_user_data } from './User'
import { DirectMessage } from './DirectMessage'

const { v4: uuidv4 } = require('uuid');

function Messages(chan_and_message: ChanAndMessage, users: User[],
				current_user: User, set_current_chan: (arg: any) => void)
{
	let is_undefined: boolean = false;
	let chan = chan_and_message.chan;
	let messages = chan_and_message.msg;
	if (typeof chan === 'undefined') {
		messages = []
		is_undefined = true
	}
	let [last_chan, setLastChan] = useState(typeof chan === 'undefined' ? "" : chan.name)
	let [formValue, setFormValue] = useState("");

	let [messagesBlocks, setMessagesBlocks] = useState(
		[...messages].reverse().map(msg => ChatMessage(users, msg, current_user))
	);

	if (is_undefined)
		return <div className='no-messages'>Please select a channel</div>

	if (messages.length === 0)
		return (<div style={{
			'display': 'flex',
			'flexDirection': 'column',
			'justifyContent': 'space-between',
			'height': '100%',
		}} key={"Message-ret-a"+uuidv4()}>
			<div className='channel-header'>
			<button className='invite-button'>
					invite
				</button>
				<div style={{
					flex: '8',
					textAlign: 'center',
				}}>
					{chan.name}
				</div>
				<button className='leave-button'
					onClick={() => leave(chan.name)}>
					leave
				</button>
			</div>
			
			<div className='no-messages' key="Message-ret-b"
				style={{
					marginTop: 'auto',
					marginBottom: 'auto'
				}}>
				No messages
			</div>
			<form className="message-box" key="Message-ret-c">
				<input type="text" className="message-input"
					placeholder="Type message..." value={ formValue }
					onChange={e => setFormValue(e.target.value)} autoFocus
					key="will_never_change"/>
				<div className="button-submit" key="Message-ret-d">
					<button type="submit" onClick={(event) => sendMessageOnClick(event, messagesBlocks)} key="Message-ret-e">Send</button>
				</div>
			</form>
		</div>);

	if (last_chan != chan.name || messagesBlocks.length < messages.length) // si c'est vide il faut l'update
	{
		setMessagesBlocks([...messages].reverse().map(msg => ChatMessage(users, msg, current_user)));
		setLastChan(chan.name);
	}

	function sendMessageOnClick(e: React.FormEvent<HTMLButtonElement>, msg: JSX.Element[])
	{
		e.preventDefault();
		if (formValue.length !== 0)
		{
			socket_chat.emit('message', {
				name: chan.name,
				sender_id: current_user.id,
				sender_name: current_user.name,
				uid: chan.curr_uid + 1,
				text: formValue,
			})
			setFormValue('');
		}
	}

	function leave(name: string) {
		fetch('/api/channel/leave', {
			method: 'POST',
			body: JSON.stringify({
				name: name,
				user_id: current_user.id,
			}),
			headers: {'Content-Type': 'application/json'},
		})
			.then(response => {
				response.json()
					.then(data => {
						if (typeof data.status === 'undefined') {
							set_current_chan({});
						}
					})
			})
	}

	return (
		<div style={{
			'display': 'flex',
			'flexDirection': 'column',
			'justifyContent': 'space-between',
			'height': '100%',
		}} key={"Message-ret-a"+uuidv4()}>

			<div className='channel-header'>
			<button className='invite-button'>
					invite
				</button>
				<div style={{
					flex: '8',
					textAlign: 'center',
				}}>
					{chan.name}
				</div>
				<button className='leave-button'
					onClick={() => leave(chan.name)}>
					leave
				</button>
			</div>

			<div id="messages" key="Message-ret-b">
				{messagesBlocks}
			</div>

			<form className="message-box" key="Message-ret-c">
				<input type="text" className="message-input"
					placeholder="Type message..." value={ formValue }
					onChange={(e) => setFormValue(e.target.value)} autoFocus
					key="will_never_change"/>
				<div className="button-submit" key="Message-ret-d">
					<button type="submit" onClick={(event) => sendMessageOnClick(event, messagesBlocks)} key="Message-ret-e">Send</button>
				</div>
			</form>
		</div>
	);
}

export default Messages
import React from 'react'
import { useState, useRef } from 'react'
import '../Home/Dashboard.css'
import ChatMessage from './ChatMessage'
import { ChanAndMessage, socket_chan } from './Chat'
import { Channel } from './Channels'
import User from '../utils/User'
import axios, { AxiosResponse, AxiosError } from 'axios';

const { v4: uuidv4 } = require('uuid');

function Messages(chan_and_message: ChanAndMessage, users: User[],
				current_user: User,
				set_current_chan: (arg: any) => void,
				setChanOfUser: (arg: any) => void,
				leaveChannel: (arg: any) => void)
{
	let is_undefined: boolean = false;
	let chan = chan_and_message.chan;
	let messages = chan_and_message.msg;
	if (typeof chan === 'undefined') {
		messages = []
		is_undefined = true
	}
	let [last_chan, setLastChan] = useState(typeof chan === 'undefined' ? "" : chan.name)
	let messageRef = useRef<HTMLInputElement | null>(null)

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
					ref={messageRef}
					placeholder="Type message..."
					key="will_never_change"
					autoFocus/>
				<div className="button-submit" key="Message-ret-d">
					<button type="submit" onClick={(event) => sendMessageOnClick(event, messagesBlocks)} key="Message-ret-e">Send</button>
				</div>
			</form>
		</div>);

	if (last_chan !== chan.name || messagesBlocks.length < messages.length) // si c'est vide il faut l'update
	{
		setMessagesBlocks([...messages].reverse().map(msg => ChatMessage(users, msg, current_user)));
		setLastChan(chan.name);
	}

	function sendMessageOnClick(e: React.FormEvent<HTMLButtonElement>, msg: JSX.Element[])
	{
		e.preventDefault();
		if (messageRef.current!.value.length !== 0)
		{
			socket_chan.emit('message', {
				name: chan.name,
				sender_id: current_user.id,
				sender_name: current_user.name,
				uid: (isNaN(chan.curr_uid + 1) ? 0 : chan.curr_uid + 1),
				text: messageRef.current!.value,
			})
			messageRef.current!.value = '';
		}
	}

	function leave(name: string) {
		const headers = {
			'Content-Type': 'application/json'
		}
		
		axios.post('/api/channel/leave', {
			name: name,
			user_id: current_user.id,
		},  { headers })
			.then((response: AxiosResponse) => {
				if (typeof response.data.status === 'undefined') {
					set_current_chan({});
					setChanOfUser((prev: Channel[]) => prev.filter(
						c => c.name !== name
					))
					leaveChannel(response.data)
				}
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
					ref={messageRef}
					placeholder="Type message..."
					key="will_never_change"
					autoFocus/>
				<div className="button-submit" key="Message-ret-d">
					<button type="submit" onClick={(event) => sendMessageOnClick(event, messagesBlocks)} key="Message-ret-e">Send</button>
				</div>
			</form>
		</div>
	);
}

export default Messages
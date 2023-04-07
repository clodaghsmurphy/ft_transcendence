import React from 'react'
import { useState, useRef } from 'react'
import '../Home/Dashboard.css'
import ChatMessage from './ChatMessage'
import { CHANNEL, ChanAndMessage, CurrentChan, DM, socket_chan, socket_dm } from './Chat'
import { Channel } from './Channels'
import User, { id_to_user } from '../utils/User'
import axios, { AxiosResponse, AxiosError } from 'axios';

const { v4: uuidv4 } = require('uuid');

type LastChan =  {
	type: boolean,
	name: string,
}

function Messages(current_chan: CurrentChan, users: User[],
				current_user: User,
				set_current_chan: (arg: any) => void,
				setChanOfUser: (arg: any) => void,
				leaveChannel: (arg: any) => void)
{
	let is_undefined: boolean = false;
	let chan = current_chan.chan!;
	let messages = current_chan.msg;
	if (typeof messages === 'undefined') {
		messages = []
		is_undefined = true
	}
	let [last_chan, setLastChan] = useState({} as LastChan)
	let messageRef = useRef<HTMLInputElement | null>(null)
	
	let [messagesBlocks, setMessagesBlocks] = useState(
		[...messages].reverse().map(msg => ChatMessage(users, msg, current_user))
		);
	let chan_name = current_chan.type === CHANNEL ? current_chan.chan!.name
								: id_to_user(users, current_chan.user!).name

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
					{chan_name}
				</div>
				<button className='leave-button'
					onClick={() => leave(chan_name)}>
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


	const wasnt_defined = typeof last_chan.name === 'undefined'
	const msg_number_diff = messages.length > messagesBlocks.length
	const same_type = last_chan.type === current_chan.type
	const same_name = last_chan.name === chan_name;
	
				
	if (wasnt_defined || (same_type && !same_name) || msg_number_diff) // si c'est vide il faut l'update
	{
		setMessagesBlocks([...messages].reverse().map(msg => ChatMessage(users, msg, current_user)));
		setLastChan({
			name: chan_name,
			type: current_chan.type
		})
	}

	function sendMessageOnClick(e: React.FormEvent<HTMLButtonElement>, msg: JSX.Element[])
	{
		e.preventDefault();
		if (current_chan.type === CHANNEL) {
			if (messageRef.current!.value.length !== 0)
			{
				socket_chan.emit('message', {
					name: chan_name,
					sender_id: current_user.id,
					sender_name: current_user.name,
					uid: (isNaN(chan.curr_uid + 1) ? 0 : chan.curr_uid + 1),
					text: messageRef.current!.value,
				})
				messageRef.current!.value = '';
			}
		} else {
			if (messageRef.current!.value.length !== 0)
			{
				socket_dm.emit('message', {
					receiver_id: current_chan.user!,
					sender_id: current_user.id,
					sender_name: current_user.name,
					uid: 667,
					text: messageRef.current!.value,
				})
				messageRef.current!.value = '';
			}
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
					{chan_name}
				</div>
				<button className='leave-button'
					onClick={() => leave(chan_name)}>
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
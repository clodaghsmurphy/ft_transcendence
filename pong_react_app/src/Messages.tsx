import React, { ChangeEvent, memo} from 'react'
import './Dashboard.css'
import user_pfp from './media/user.png'
import nathan from './media/nguiard.jpg'
import clodagh from './media/clmurphy.jpg'
import { Avatar } from '@mui/material'
import { useState, useRef } from 'react'
import ChatMessage from './ChatMessage'
import Chat from './Chat'
import { MessageData, Channel, NORMAL, BAN, KICK, INVITE } from './Channels'
import User, { avatarOf, id_to_user, sample_user_data } from './User'
import { DirectMessage } from './DirectMessage'

const { v4: uuidv4 } = require('uuid');

function Messages(chan: Channel, users: User[], current_user: User)
{
	let is_undefined: boolean = false;
	let messages: MessageData[] = chan.messages;
	if (typeof messages === 'undefined') {
		messages = []
		is_undefined = true
	}
	let [last_chan, setLastChan] = useState(typeof chan.name === 'undefined' ? "" : chan.name)
	let [formValue, setFormValue] = useState("");
	let [messagesBlocks, setMessagesBlocks] = useState(
		[...messages].reverse().map(msg => ChatMessage(users, msg, current_user))
	);

	if (is_undefined)
		return <div className='no-messages'>Please select a channel</div>

	if (chan.messages.length === 0)
		return <div key={"no_messages_key"}>No messages</div>;

	if (messagesBlocks.length === 0 || last_chan != chan.name) // si c'est vide il faut l'update
	{
		setMessagesBlocks([...messages].reverse().map(msg => ChatMessage(users, msg, current_user)));
		setLastChan(chan.name);
	}

	function sendMessageOnClick(e: React.FormEvent<HTMLButtonElement>, msg: JSX.Element[])
	{
		e.preventDefault();
		let test = { 
			text: formValue,
			uid:  chan.curr_uid + 1,
			sender_name: current_user.name,
			sender_id: current_user.id,
			from: chan.name,
			type: NORMAL
		}
		if (formValue.length !== 0)
		{
			let tmp = msg
			tmp.unshift(ChatMessage(users, test, current_user))
			setMessagesBlocks(tmp);
			chan.curr_uid += 1
			//post update chan
			setFormValue('');
		}
	}

	return (
		<div style={{
			'display': 'flex',
			'flexDirection': 'column',
			'justifyContent': 'space-between',
			'height': '100%',
		}} key={"Message-ret-a"+uuidv4()}>
			<div id="messages" key="Message-ret-b">
				{messagesBlocks}
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
		</div>
	);
}

export default Messages
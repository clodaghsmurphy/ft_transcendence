import React, { ChangeEvent, memo} from 'react'
import './Dashboard.css'
import user_pfp from './media/user.png'
import nathan from './media/nguiard.jpg'
import clodagh from './media/clmurphy.jpg'
import { Avatar } from '@mui/material'
import { useState, useRef } from 'react'
import ChatMessage from './ChatMessage'
import Chat from './Chat'
import { Channel, NORMAL, BAN, KICK, INVITE } from './Channels'
import User, { avatarOf, name_to_user, sample_user_data } from './User'

const { v4: uuidv4 } = require('uuid');

function Messages(chan: Channel, users: User[], current_user: User)
{
	console.log("Inside Message()")
	let messages: MessageData[] = chan.messages
	let [formValue, setFormValue] = useState("");
	let [messagesBlocks, setMessagesBlocks] = useState(
		messages.map(msg => ChatMessage(users, msg, current_user))
	);

	interface MessageData {
		type: number;
		text: string;
		uid: number;
		name: string;
	}

	function sendMessage(e: React.FormEvent<HTMLButtonElement>)
	{
		e.preventDefault();
		let test = { 
			text: formValue,
			uid:	Math.floor(Math.random()),
			name: "clmurphy",
			type: NORMAL
		}
		if (formValue.length !== 0)
		{
			let tmp = messagesBlocks
			tmp.push(ChatMessage(users, test, current_user))
			setMessagesBlocks(tmp);
			setFormValue('');
		}
	}

	return (
		<div style={{
			'display': 'flex',
			'flexDirection': 'column',
			'justifyContent': 'space-between',
			'height': '95%',
		}} key="Message-ret-a">
			<div id="messages" style={{overflowY: 'scroll'}} key="Message-ret-b">
				{messagesBlocks}
			</div>
			<form className="message-box" key="Message-ret-c">
				<input type="text" className="message-input" placeholder="Type message..." value={ formValue } onChange={(e: ChangeEvent<HTMLInputElement>) => setFormValue(e.target.value)} key="will_never_change"/>
				<div className="button-submit" key="Message-ret-d">
					<button type="submit" onClick={(event) => sendMessage(event)} key="Message-ret-e">Send</button>
				</div>
			</form>
		</div>
	);
}

export default Messages
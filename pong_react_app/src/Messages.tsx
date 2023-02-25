import React, { ChangeEvent } from 'react'
import './Dashboard.css'
import user_pfp from './media/user.png'
import nathan from './media/nguiard.jpg'
import clodagh from './media/clmurphy.jpg'
import { Avatar } from '@mui/material'
import { useState, useRef } from 'react'
import ChatMessage from './ChatMessage'
import Chat from './Chat'
import { Channel, NORMAL, BAN, KICK, INVITE } from './Channels'
import User, { avatarOf } from './User'

const { v4: uuidv4 } = require('uuid');

function Messages(channels: Channel[], users: User[])
{
	const messageScroll = useRef<HTMLSpanElement>(null);
	let messages: MessageData[] = [
		{
			type: 0,
			text: "Tu as fait tes attaques gdc ajd? ",
			uid: 1,
			name: "clmurphy"
		},
		{
			type: 0,
			text: "Bah bien sur que oui je suis trop fort",
			uid: 2,
			name: "nguiard"
		}
	]
	let [formValue, setFormValue] = useState("");
	let [messagesBlocks, setMessagesBlocks] = useState(
		messages.map(msg => ChatMessage(msg, avatarOf(users, msg.name)))
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
			tmp.push(ChatMessage(test, avatarOf(users, test.name)))
			setMessagesBlocks(tmp);
		}
		setFormValue('');
		messageScroll.current?.scrollIntoView({ behavior: 'smooth'})
	}

	return(
		<div style={{
			'display': 'flex',
			'flexDirection': 'column',
			'justifyContent': 'space-between'
		}} key="Message-ret-a">
			<div id="messages" style={{overflowY: 'scroll'}} key="Message-ret-b">
				{messagesBlocks}
			</div>
			<form className="message-box" key="Message-ret-c">
				<input type="text" className="message-input" placeholder="Type message..." value={ formValue } onChange={(e: ChangeEvent<HTMLInputElement>) => setFormValue(e.target.value)} key="will_never_change"/>
				<div className="button-submit" key="Message-ret-d">
					<button type="submit" onClick={sendMessage} key="Message-ret-e">Send</button>
				</div>
			</form>
		</div>
	);
}

export default Messages
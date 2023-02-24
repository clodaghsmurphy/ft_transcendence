import React, { ChangeEvent } from 'react'
import './Dashboard.css'
import user_pfp from './media/user.png'
import nathan from './media/nguiard.jpg'
import clodagh from './media/clmurphy.jpg'
import { Avatar } from '@mui/material'
import { useState } from 'react'
import ChatMessage from './ChatMessage'




function Messages()
{
	const [formValue, setFormValue] = useState("");
	const [messages, setMessages] = useState(
		[
			{
				createdAt: new Date(),
				PhotoUrl: clodagh,
				text: "Tu as fait tes attaques gdc ajd? ",
				uid: 1,
				name: "clmurhpy"
			},
			{
				createdAt: new Date(),
				PhotoUrl: nathan,
				text: "Bah bien sur que oui je suis trop fort",
				uid: 2,
				name: "nguiard"
			}
		]
	);

	interface MessageData {
		createdAt: Date;
		PhotoUrl: string;
		text: string;
		uid: number;
		name: string;

	} 
	
	// var messages: MessageData[] = 
	// [
	// 	{
	// 		createdAt: new Date(),
	// 		PhotoUrl: './media/user.png',
	// 		text: "Tu as fait tes attaques gdc ajd? ",
	// 		uid: 1,
	// 		name: "Clodagh"
	// 	},
	// 	{
	// 		createdAt: new Date(),
	// 		PhotoUrl: './media/user.png',
	// 		text: "Bah bien sur que oui je suis trop fort",
	// 		uid: 2,
	// 		name: "Nathan"
	// 	}
	// ];


	const sendMessage = (e: React.FormEvent<HTMLButtonElement>) =>
	{
		e.preventDefault();
		var temp: MessageData[] = [
			...messages,
			{ 
			createdAt: new Date(),
			PhotoUrl: clodagh,
			text: formValue,
			uid:	Math.floor(Math.random()),
			name: "clmurphy"
		}
	];
		if (temp[temp.length - 1].text.length)
			setMessages(temp);
		console.log(messages);
		setFormValue('');
	}
	return(
		<div style={{
			'display': 'flex',
			'flexDirection': 'column'
		}}>
			<div id="messages" style={{overflowY: 'scroll'}}>
				{messages && messages.map(msg => ChatMessage(msg))}			
			</div>
			<form className="message-box">
				<input type="text" className="message-input" placeholder="Type message..." value={ formValue } onChange={(e: ChangeEvent<HTMLInputElement>) => setFormValue(e.target.value)}/>
				<div className="button-submit">
					<button type="submit" onClick={sendMessage}>Send</button>
				</div>
			</form>
		</div>
	);
}

export default Messages
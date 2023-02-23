import React, { ChangeEvent } from 'react'
import './Dashboard.css'
import user_pfp from './media/user.png'
import nathan from './media/nguiard.jpg'
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
				PhotoUrl: './media/user.png',
				text: "Tu as fait tes attaques gdc ajd? ",
				uid: 1,
				name: "Clodagh"
			},
			{
				createdAt: new Date(),
				PhotoUrl: './media/user.png',
				text: "Bah bien sur que oui je suis trop fort",
				uid: 2,
				name: "Nathan"
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
			PhotoUrl: './media/user.png',
			text: formValue,
			uid:	Math.floor(Math.random()),
			name: "Clodagh"
		}
	];
		setMessages(temp);
		console.log(messages);
		setFormValue('');
	}
	return(
		<div id="messages">
			{messages && messages.map(msg => <ChatMessage name={msg.name} text={msg.text} uid={msg.uid} PhotoUrl={msg.PhotoUrl} />)}			
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
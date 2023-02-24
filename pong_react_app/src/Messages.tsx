import React, { ChangeEvent } from 'react'
import './Dashboard.css'
import user_pfp from './media/user.png'
import nathan from './media/nguiard.jpg'
import clodagh from './media/clmurphy.jpg'
import { Avatar } from '@mui/material'
import { useState } from 'react'
import ChatMessage from './ChatMessage'
import Chat from './Chat'


const { v4: uuidv4 } = require('uuid');


function Messages()
{
	const messages: MessageData[] = [
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
	const [formValue, setFormValue] = useState("");
	const [messagesBlocks, setMessagesBlocks] = useState(
		messages.map(msg => ChatMessage(msg))
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
		messages.push(
			{ 
			createdAt: new Date(),
			PhotoUrl: clodagh,
			text: formValue,
			uid:	Math.floor(Math.random()),
			name: "clmurphy"
			}
		)
		if (formValue.length != 0)
		{
			console.log("ADDING MESSAGE " + formValue);
			setMessagesBlocks(messages.map(msg => ChatMessage(msg)));
		}
		setFormValue('');
	}
	return(
		<div style={{
			'display': 'flex',
			'flexDirection': 'column'
		}} key={uuidv4()}>
			<div id="messages" style={{overflowY: 'scroll'}} key={uuidv4()}>
				{messagesBlocks}			
			</div>
			<form className="message-box" key={uuidv4()}>
				<input type="text" className="message-input" placeholder="Type message..." value={ formValue } onChange={(e: ChangeEvent<HTMLInputElement>) => setFormValue(e.target.value)} key={uuidv4()}/>
				<div className="button-submit" key={uuidv4()}>
					<button type="submit" onClick={sendMessage} key={uuidv4()}>Send</button>
				</div>
			</form>
		</div>
	);
}

export default Messages
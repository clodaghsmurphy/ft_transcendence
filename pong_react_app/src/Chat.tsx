import React, { MouseEventHandler, useEffect, useState } from 'react'
import NavBar from './NavBar'
import Messages from './Messages'
import './Dashboard.css'
import './Chat.css'
import adam from './media/adben-mc.jpg'
import pierre from './media/ple-lez.jpg'
import clodagh from './media/clmurphy.jpg'
import nathan from './media/nguiard.jpg'
import group_img from './media/group.png'
import test_img	from './media/test.jpg'
import Button from '@mui/material/Button'
import { Avatar } from '@mui/material'
import { user_in_group } from './UserGroup'
import { SearchBar } from './SearchBar'
import User, { error_user, name_to_user, sample_user_data } from './User'
import { BAN, Channel, INVITE, KICK, basic_channel, sample_channel_data } from './Channels'
import { api_get_all_users } from './API'
// import axios from 'axios'

const { v4: uuidv4 } = require('uuid');


type User_message = {user: User, message: string}
type Group_message = {name: string, message: string}
type Group_user_data = {user: User, status: number, is_op: boolean}

function chat_button(name: string, message: string, img: string) {
	return (
		<div className='chat-button-wrapper' key={uuidv4()}>
			<button className='chat-button'>
				<img src={img} alt={name}
					style={{'width': '3.5em', 'height': 'auto',
						'aspectRatio': '10 / 9', 'paddingLeft': '0px',
						'paddingRight': '5px'}}>
				</img>
				<div>
					<h2>{name}</h2>
					<div>{message}</div>
				</div>
			</button>
		</div>
	);
}

function users_message(message_data: User_message[]) {
	let ret: JSX.Element[] = [];

	for (const data of message_data) {
		ret.push(chat_button(data.user.name, data.message, data.user.avatar));
	}
	return ret;
}

function group_message(chan_data: Channel[]) {
	let ret: JSX.Element[] = [];

	for (const chan of chan_data) {
		let target_message = chan.messages[chan.messages.length - 1]

		let message_text: string = (
			target_message.type == BAN ||
			target_message.type == INVITE ||
			target_message.type == KICK ?
			target_message.name + target_message.text :
			target_message.text
		)

		ret.push(chat_button(chan.name, message_text, group_img));
	}
	return ret;
}
 
// function user_in_group(every_user: User[], current_user: User, chan: Channel) {
// 	let ret: JSX.Element[] = [];

// 	for (const name of chan.members) {
// 		if (name == current_user.name)
// 			continue
// 		if (current_user.blocked_users.find(target => target == name))
// 			ret.push(in_user_button_blocked(name_to_user(every_user, name), chan.op.includes(name)));
// 		else if (current_user.friend_users.find(target => target == name))
// 			ret.push(in_user_button_friend(name_to_user(every_user, name), chan.op.includes(name)));
// 		else
// 			ret.push(in_user_button_normal(name_to_user(every_user, name), chan.op.includes(name)));
// 	}
// 	return ret;
// }

function chat_after_fetch() {
	
}

function Chat()
{
	// To change for an API call to get every users
	const [isLoading, setLoading] = useState(true);
	let [all_users, set_all_users] = useState([] as User[])


	useEffect(() => {
		document.title = 'Chat';
		fetch('/api/user/info', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			}
		}).then((response) => {
			console.log("RESPONSE: ",response);
			response.json()
				.then(data => {
					console.log("test: ", data);
					set_all_users(data as User[])
					setLoading(false);
				})
		})
	  }, []);
	
	if (isLoading) {
		// set_all_users([])
		// setLoading(true)
		Messages(basic_channel(), [] as User[], error_user())
		return (<div>loading...</div>)
	}

	console.log(all_users)
	// axios.get('/api/user/info')
	// 	.then((data: User[]) => {
	// 		all_users= data
	// 	})
	// console.log("\\\\\\", all_users)
	let all_channels: Channel[] = sample_channel_data()
	let current_chan: Channel = all_channels[0]
	let current_user: User = typeof all_users.find(usr => usr.name == "nguiard") == 'string' ? all_users.find(usr => usr.name == "nguiard") as User : all_users[0]
	let messages = Messages(current_chan, all_users, current_user)

	// console.log(all_users)

	// To change for an API call to get currently connected user

	let message_user_data: User_message[] = [
		{
			user: all_users[0],
			"message": "18h == matin",
		},
		{
			user: all_users[1],
			"message": "webserv > irc",
		},
		{
			user: all_users[2],
			"message": "jsp quoi dire",
		},
		{
			user: all_users[3],
			"message": "je speedrun le TC",
		}
	];

	let every_user_name: string[] = all_users.map(user => user.name);

	function doesNothing(str: string): MouseEventHandler<HTMLButtonElement> | undefined {
		console.log("Tried to open a chat between " + current_user.name +
			" and " + str)
		return ;
	}

	return (	
		<div className="dashboard">
        <NavBar /> 
        <main className="page-wrapper">
            <div className="channels">
				<h1>Messages</h1>

				<div style={{ 'marginLeft': '5%', 'marginRight': '0',
					'width': '100%', 'overflow': 'visible'}}>
				{/* {SearchBar(every_user_name, doesNothing)} */}
					{/* search
				</input> */}
					{/* <button type='submit'>
						<img src="./media/search-icon.jpg"></img>
					</button> */}
				</div>

				<div className='bar'></div>
				<div className='lists'>
					<h1>Group chats</h1>
					<div className='lists-holder'>
						{group_message(all_channels)}
					</div>
				</div>

				<div className='bar'></div>
				<div className='lists'>
					<h1>User messages</h1>
					<div className='lists-holder'>
						{users_message(message_user_data)}
					</div>
					<div className='channels-holder'></div>
				</div>
				{/* Cette div sert a "contenir" celles d'au dessus pour
					eviter qu'elles depacent de la fenetre				*/}
				<div className='channels-holder'></div>
			</div>

            <div className="chatbox">
				{messages}
			</div>

            <div className="group-members">
				<h1>Group users</h1>
				
				<div className='user-holder'>
					{user_in_group(all_users, current_user, current_chan)}
				</div>
			</div>
        </main>
        </div>
    );
}

export default Chat;
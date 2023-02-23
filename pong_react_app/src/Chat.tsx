import React, { useEffect } from 'react'
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
import {	in_user_button_friend,
			in_user_button_blocked,
			in_user_button_normal} from './UserGroup'
import { SearchBar } from './SearchBar'
import User, { sample_data } from './User'


const { v4: uuidv4 } = require('uuid');

type User_message = {user: User, message: string}
type Group_message = {name: string, message: string}
type Group_user_data = {user: User, status: number, is_op: boolean}

function chat_button(name: string, message: string, img: string) {
	return (
		<Button className='chat-button' variant='outlined' key={uuidv4()}>
			<Avatar src={img} alt={name}
				sx={{'width': '3em', 'height': 'auto',
					'aspectRatio': '1 / 1', 'paddingLeft': '0px',
					'paddingRight': '5px'}}>
			</Avatar>
			<div>
				<h2>{name}</h2>
				<div>{message}</div>
			</div>
		</Button>
	);
}

function users_message(message_data: User_message[]) {
	let ret: JSX.Element[] = [];

	for (const data of message_data) {
		ret.push(chat_button(data.user.name, data.message, data.user.avatar));
	}
	return ret;
}

function group_message(group_data: Group_message[]) {
	let ret: JSX.Element[] = [];

	for (const group of group_data) {
		ret.push(chat_button(group.name, group.message, group_img));
	}
	return ret;
}
 
function user_in_group(group_user_data: Group_user_data[]) {
	let ret: JSX.Element[] = [];

	for (const data of group_user_data) {
		if (data.status === 1) {
			ret.push(in_user_button_friend(data.user.name, data.user.avatar, data.is_op));
		} else if (data.status === -1) {
			ret.push(in_user_button_blocked(data.user.name, data.user.avatar, data.is_op));
		} else {
			ret.push(in_user_button_normal(data.user.name, data.user.avatar, data.is_op));
		}
	}
	return ret;
}

function Chat()
{
	// To change for an API call to get every users
	let all_users: User[] = sample_data();

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

	let group_message_data: Group_message[] = [
		{
			"name": "Trascendence",
			"message": "Salut tout le monde!",
		},
		{
			"name": "Groupe 2",
			"message": "bla bla bla bla bla bla bla bla bla",
		},
		{
			"name": "Illuminatis",
			"message": "On vas conquerir le monde",
		},
	];

	let user_in_group_data: Group_user_data[] = [
		{
			user: all_users[0],
			"is_op": true,
			"status": 1,
		},
		{
			user: all_users[1],
			"is_op": false,
			"status": 0,
		},
		{
			user: all_users[2],
			"is_op": false,
			"status": 0,
		},
		{
			user: all_users[3],
			"is_op": false,
			"status": -1,
		}
	]

	let every_user_name: string[] = all_users.map(user => user.name);

	useEffect(() => {
		document.title = 'Chat';
	}, []);

	return (	
		<div className="dashboard">
        <NavBar /> 
        <main className="page-wrapper">
            <div className="channels">
				<h1>Messages</h1>

				<div style={{ 'marginLeft': '5%', 'marginRight': '0',
					'width': '100%', 'overflow': 'visible'}}>
				{SearchBar(every_user_name)}
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
						{group_message(group_message_data)}
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
				{/* <div className='channels-holder'></div> */}
			</div>

            <div className="chatbox">
				<Messages />
			</div>

            <div className="group-members">
				<h1>Group users</h1>
				
				<div className='user-holder'>
					
					{user_in_group(user_in_group_data)}
				</div>
			</div>
        </main>
        </div>
    );
}

export default Chat;
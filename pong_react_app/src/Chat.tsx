import React, { NamedExoticComponent } from 'react'
import NavBar from './NavBar'
import Messages from './Messages'
import './Dashboard.css'
import './Chat.css'
import {useState} from 'react'
import adam from './media/adben-mc.jpg'
import pierre from './media/ple-lez.jpg'
import clodagh from './media/clmurphy.jpg'
import nathan from './media/nguiard.jpg'
import group_img from './media/group.png'
import search_icon from './media/search-icon.jpg'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { Avatar } from '@mui/material'
import stringAvatar from '@mui/material/Avatar'
import {	in_user_button_friend,
			in_user_button_blocked,
			in_user_button_normal} from './UserGroup'

// import Group from '@mui/icons-material/'
// import

type User_message = {name: string, message: string, img: string, key: number}
type Group_message = {name: string, message: string}
type Group_user_data = {name: string, img: string, status: number, is_op: boolean}

function chat_button(name: string, message: string, img: string) {
	return (
		<Button className='chat-button' variant='outlined'>
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

function users_message(user_data: User_message[]) {
	let ret: JSX.Element[] = [];

	for (const user of user_data) {
		ret.push(chat_button(user.name, user.message, user.img));
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

function user_in_group(users: Group_user_data[]) {
	let ret: JSX.Element[] = [];

	for (const user of users) {
		if (user.status == 1) {
			ret.push(in_user_button_friend(user.name, user.img, user.is_op));
		} else if (user.status == -1) {
			ret.push(in_user_button_blocked(user.name, user.img, user.is_op));
		} else {
			ret.push(in_user_button_normal(user.name, user.img, user.is_op));
		}
	}
	return ret;
}

function Chat()
{
	let message_user_data: User_message[] = [
		{
			"name": "nguiard",
			"message": "jsp quoi dire",
			"img": nathan,
			"key": 0,
		},
		{
			"name": "clmurphy",
			"message": "webserv > irc",
			"img": clodagh,
			"key": 1,
		},
		{
			"name": "adben-mc",
			"message": "18h == matin",
			"img": adam,
			"key": 2,
		},
		{
			"name": "ple-lez",
			"message": "je speedrun le TC",
			"img": pierre,
			"key": 3,
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
			"name": "adben-mc",
			"is_op": true,
			"status": 1,
			"img": adam
		},
		{
			"name": "ple-lez",
			"is_op": false,
			"status": 0,
			"img": pierre
		},
		{
			"name": "clmurphy",
			"is_op": false,
			"status": 0,
			"img": clodagh
		},
		{
			"name": "nguiard",
			"is_op": false,
			"status": -1,
			"img": nathan
		}
	]

	return (	
		<div className="dashboard">
        <NavBar /> 
        <main className="page-wrapper">
            <div className="channels">
				<h1>Messages</h1>

				<div style={{ 'marginLeft': '5%', 'marginRight': '0',
					'width': '100%'}}>
				<TextField variant='standard' size='small' label='Search'
					sx={{'width': '90%', 'marginLeft': '0'
					, 'marginRight': '0'}}/>
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
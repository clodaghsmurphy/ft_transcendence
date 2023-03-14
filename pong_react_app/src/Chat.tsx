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
import plus_sign from './media/white_plus.png'
import { SearchBar } from './SearchBar'
import User, { error_user, id_to_user, sample_user_data } from './User'
import { BAN, Channel, INVITE, KICK, basic_channel, names_to_channel, sample_channel_data } from './Channels'
import PopupAddChannel from './PopupAddChannel'
import io from 'socket.io-client'

const { v4: uuidv4 } = require('uuid');

type User_message = {user: User, message: string}

function chat_button(name: string, message: string, img: string, fnc: (chan: Channel | User) => void, param: Channel | User) {
	return (
		<div className='chat-button-wrapper' key={uuidv4()} onClick={() => fnc(param)}>
			<button className='chat-button'>
				<img src={img} alt={name}
					style={{'width': '45px', 'height': '45px',
						'maxWidth': '45px', 'maxHeight': '45px',
						'aspectRatio': '1 / 1', 'paddingLeft': '0px',
						'paddingRight': '0px'}}>
				</img>
				<div>
					<h2>{name}</h2>
					<div>{message}</div>
				</div>
			</button>
		</div>
	);
}

function users_message(message_data: User_message[], click_handler: (param: Channel | User) => void) {
	let ret: JSX.Element[] = [];

	if (message_data.length === 0) {
		return <></>
	}

	for (const data of message_data) {
		if (typeof data === 'undefined' || typeof data.user === 'undefined')
			return <></>
		ret.push(chat_button(data.user.name, data.message, data.user.avatar, click_handler, data.user));
	}
	ret.push(add_dm())
	return ret;
}

export function add_group(): JSX.Element {
	return (
		<div className='chat-button-wrapper' key={uuidv4()}>
			<button className='chat-button'>
				<div className='group-add'>
					<img src={plus_sign} alt='plus'/>
					<h1>Add a group</h1>
				</div>
			</button>
		</div>
	);
}

function add_dm(): JSX.Element {
	return (
		<div className='chat-button-wrapper' key={uuidv4()}>
			<button className='chat-button'>
				<div className='group-add'>
					<img src={plus_sign} alt='plus'/>
					<h1>Add a DM</h1>
				</div>
			</button>
		</div>
	);
}

function group_message(chan_data: Channel[], click_handler: (chan: Channel | User) => void,
	every_user: User[], current_user: User) {
	let ret: JSX.Element[] = [];

	for (const chan of chan_data) {
		let target_message = chan.messages[chan.messages.length - 1]

		let message_text: string = (
			target_message.type == BAN ||
			target_message.type == KICK ?
			target_message.sender_name + target_message.text :
			target_message.text
		)
		if (target_message.type)
			message_text = target_message.sender_name + " sent an invite"
		ret.push(chat_button(chan.name, message_text, group_img, click_handler, chan));
	}
	ret.push(PopupAddChannel(every_user, current_user))
	return ret;
}

function Chat()
{
	let [all_users, set_all_users] = useState([] as User[])
	let [all_channels, set_all_channels] = useState([] as Channel[])
	let [current_user, set_current_user] = useState({} as User)
	let [current_chan, set_current_chan] = useState({} as Channel)
	let [chanOfUser, setChanOfUser] = useState(names_to_channel(all_channels, typeof current_user === 'undefined' ? [] : current_user.channels))

	useEffect(() => {
		document.title = 'Chat';
		fetch('/api/user/info', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			}
		}).then((response) => {
			response.json()
				.then(data => {
					set_all_users(data as User[])
					set_current_user(data[2] as User) // A changer par jsp quoi
				})
			})

		fetch('/api/channel/info')
			.then((response) => {
				response.json()
				.then(data => {
				set_all_channels(data as Channel[])
				setChanOfUser(names_to_channel(all_channels,
					typeof current_user.channels === 'undefined' ? [] : current_user.channels))
				})
			})
	}, []);
	
	let message_user_data: User_message[] = [
		{
			user: id_to_user(all_users, 1),
			"message": "18h == matin",
		},
		{
			user: id_to_user(all_users, 2),
			"message": "webserv > irc",
		},
		{
			user: id_to_user(all_users, 3),
			"message": "jsp quoi dire",
		},
		{
			user: id_to_user(all_users, 4),
			"message": "je speedrun le TC",
		}
	];

	function changeChannelOrDm(param: Channel | User): void {
		if (typeof (param as Channel).op !== 'undefined')
			set_current_chan(param as Channel)
		/// else changer le DM
	}

	return (	
		<div className="dashboard">
        <NavBar /> 
        <main className="page-wrapper">
            <div className="channels">
				<h1>Messages</h1>

				<div className='bar'></div>
					<div className='lists'>
						<h1>Group chats</h1>
						<div className='lists-holder'>
							{group_message(chanOfUser, changeChannelOrDm, all_users, current_user)}
						</div>
					</div>

					<div className='bar'></div>
					<div className='lists'>
						<h1>User messages</h1>
						<div className='lists-holder'>
							{users_message(message_user_data, changeChannelOrDm)}
						</div>
						<div className='channels-holder'></div>
					</div>
				<div className='channels-holder'></div>
			</div>

            <div className="chatbox">
				{Messages(current_chan, all_users, current_user)}
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
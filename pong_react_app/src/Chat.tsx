import React, { MouseEventHandler, useEffect, useState, useContext } from 'react'
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
import { BAN, Channel, INVITE, KICK, MessageData, basic_channel, names_to_channel, sample_channel_data } from './Channels'
import PopupAddChannel from './PopupAddChannel'
import io from 'socket.io-client'
import { sample_DM_data, DirectMessage, dm_of_user, dm_betweeen_two_users } from './DirectMessage'
import { AuthContext } from './App'
import PopupAddDirect from './PopupAddDirect'

const { v4: uuidv4 } = require('uuid');

export type ChanAndMessage = {
	chan: Channel,
	msg: MessageData[],
}

function chat_button(name: string, message: string, img: string,
	fnc: (chan: Channel | DirectMessage) => void, param: Channel | DirectMessage)
{
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

function users_message(message_data: DirectMessage[], all_users: User[],
		current_user: User, click_handler: (param: Channel | DirectMessage) => void)
{
	let ret: JSX.Element[] = [];

	if (message_data.length === 0) {
		return [PopupAddDirect(all_users, current_user)]
	}

	for (const dm of message_data) {
		if (typeof dm === 'undefined' || typeof dm.users === 'undefined')
			return [PopupAddDirect(all_users, current_user)]
		let user = id_to_user(all_users, dm.users[0]);
		if (user.id == current_user.id) {
			user = id_to_user(all_users, dm.users[1]);
		}

		let direct = dm_betweeen_two_users(current_user, user);

		ret.push(chat_button(user.name, dm.messages[dm.messages.length - 1].text,
			user.avatar, click_handler, direct));
	}
	ret.push(PopupAddDirect(all_users, current_user))
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

export function add_dm(): JSX.Element {
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

function group_message(chan_data: Channel[], click_handler: (chan: Channel | DirectMessage) => void,
	every_user: User[], current_user: User) {
	let ret: JSX.Element[] = [];

	for (const chan of chan_data) {
		let target_message = chan.messages[chan.messages.length - 1]

		if (typeof target_message === 'undefined')
		{
			ret.push(chat_button(chan.name, '', group_img, click_handler, chan));
			continue
		}

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
	const { state, dispatch } = useContext(AuthContext);
	let [all_users, set_all_users] = useState([] as User[])
	let [all_channels, set_all_channels] = useState([] as Channel[])
	let [current_user, set_current_user] = useState({} as User)
	let [current_chan, set_current_chan] = useState({} as ChanAndMessage | DirectMessage)
	let [current_messages, set_current_messages] = useState([] as MessageData[])
	let [chanOfUser, setChanOfUser] = useState([] as Channel[])
	// const socket = io("ws://localhost:8080/api/channel");
	
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
				set_current_user(id_to_user(data as User[], Number(state.user.id)))
				})
			})
			
			fetch('/api/channel/info')
			.then((response) => {
				response.json()
				.then(data => {
					set_all_channels(data as Channel[])
				})
			})
		}, []);
		
		if (typeof current_user !== 'undefined'
		&& typeof all_channels[0] !== 'undefined'
		&& chanOfUser.length == 0)
		{
			setChanOfUser(names_to_channel(all_channels, current_user.channels))
		}
		
	let direct_messages = dm_of_user(current_user);

	function changeChannelOrDm(param: Channel | DirectMessage): void {
		if (typeof (param as Channel).operators !== 'undefined')
		{
			set_current_chan({
				chan: param as Channel,
				msg: [],
			})
			set_current_messages([])
			fetch('/api/channel/' + (param as Channel).name + '/messages/')
				.then(response => {
					response.json()
						.then(data => {
							set_current_chan({
								chan: param as Channel,
								msg: data as MessageData[],
							})
						})
				})
		}
		if (typeof (param as DirectMessage).messages !== 'undefined')
			set_current_chan(param as DirectMessage)
	}

	// console.log(current_user.id);

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
							{group_message(chanOfUser,
								changeChannelOrDm, all_users, current_user)}
						</div>
					</div>

					<div className='bar'></div>
					<div className='lists'>
						<h1>User messages</h1>
						<div className='lists-holder'>
							{users_message(direct_messages,
								all_users, current_user, changeChannelOrDm)}
						</div>
						<div className='channels-holder'></div>
					</div>
				<div className='channels-holder'></div>
			</div>

            <div className="chatbox">
				{Messages(current_chan as ChanAndMessage,
					all_users, current_user)}
			</div>

            <div className="group-members">
				<h1>Group users</h1>
				
				<div className='user-holder'>
					{user_in_group(all_users, current_user, (current_chan as ChanAndMessage).chan)}
				</div>
			</div>
        </main>
        </div>
    );
}

export default Chat;

import React, { MouseEventHandler, useEffect, useState, useContext, useCallback, useRef } from 'react'
import NavBar from './NavBar'
import Messages from './Messages'
import './Dashboard.css'
import './Chat.css'
import group_img from './media/group.png'
import { user_in_group } from './UserGroup'
import User, { error_user, id_to_user, sample_user_data } from './User'
import { BAN, Channel, INVITE, KICK, MUTE, MessageData, basic_channel, names_to_channel, sample_channel_data } from './Channels'
import PopupAddChannel from './PopupAddChannel'
import io from 'socket.io-client'
import { sample_DM_data, DirectMessage, dm_of_user, dm_betweeen_two_users } from './DirectMessage'
import { AuthContext } from './App'
import PopupAddDirect from './PopupAddDirect'
import { group_message, users_message } from './ChatUtils'

const { v4: uuidv4 } = require('uuid');

export type ChanAndMessage = {
	chan: Channel,
	msg: MessageData[],
}

export const socket_chat = io(`http://${window.location.hostname}:8080/channel`)

socket_chat.on('connect', () => {
	console.log('CONNECTED', socket_chat.connected)
})

function Chat()
{
	const { state, dispatch } = useContext(AuthContext);
	let [all_users, set_all_users] = useState([] as User[])
	let [all_channels, set_all_channels] = useState([] as Channel[])
	let [current_user, set_current_user] = useState({} as User)
	let [current_chan, set_current_chan] = useState({} as ChanAndMessage | DirectMessage)
	let [chanOfUser, setChanOfUser] = useState([] as Channel[])

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

	useEffect(() => {
		socket_chat.removeListener('message')
		const handleMessage = (param: any) => {
			if (typeof (current_chan as ChanAndMessage).msg === 'undefined')
				return;

			set_current_chan((current_chan: ChanAndMessage | DirectMessage) => ({
				...current_chan,
				msg: [...(current_chan as ChanAndMessage).msg, param]
			}));
		}

		socket_chat.on('message', handleMessage)
	}, [current_chan, set_current_chan])

	useEffect(() => {
		// on removeListener pour eviter d'avour plusieurs listening d'event
		socket_chat.removeListener('mute')
		socket_chat.removeListener('join')

		console.log('in useEffect of handle mute / join')

		const handleMute = (data: any) => {
			console.log('recieved the mute')
			if (data.user === current_user.id) {
				let chan = all_channels.filter((c: Channel) => c.name === data.name)[0]
				let target = id_to_user(all_users, data.target_id).name;
				let kick_message = " has muted " + target + " for " + data.mute_duration
				socket_chat.emit('message', {
					name: data.name,
					sender_id: current_user.id,
					sender_name: current_user.name,
					uid: chan.curr_uid + 1,
					text: kick_message,
					type: MUTE,
				})
			}
		}

		const handleJoin = (data: any) => {
			console.log('recieved join ' + data.name)
			let chan_name = data.name;
			if (typeof all_channels.find((chan: Channel) => 
					chan.name === chan_name
				) === 'undefined')
			{
				fetch('/api/channel/info/' + chan_name)
				.then((response) => {
					response.json()
						.then((data) => {
							set_all_channels((prev: Channel[]) => [...prev, data])
							setChanOfUser((prev: Channel[]) => [...prev, data])
							fetch('/api/channel/' + data.name + '/messages/')
								.then(response => {
									response.json()
										.then(msg_data => {
											set_current_chan({
												chan: data as Channel,
												msg: msg_data,
											})
										})
								})
						})
				})
			}
		}

		socket_chat.on('join', handleJoin)
		socket_chat.on('mute', handleMute)
	}, [all_channels, set_all_channels])

	useEffect(() => {
		socket_chat.removeListener('makeop')

		const handleMakeop = (data: any) => {
			set_current_chan((prev: ChanAndMessage | DirectMessage) => ({
				...prev,
				chan: {
					...(prev as ChanAndMessage).chan,
					operators: [...(prev as ChanAndMessage).chan.operators, data.target_id],
				}
			}))
		}

		socket_chat.on('makeop', handleMakeop)
	}, [current_chan, set_current_chan])

	useEffect(() => {
		socket_chat.removeListener('kick')
		socket_chat.removeListener('ban')

		const handleKick = (data: any) => {
			console.log('inside handleKick:', data)
			if (data.user_id !== current_user.id) {
				socket_chat.emit('message', {
					name: data.name,
					sender_id: current_user.id,
					sender_name: current_user.name,
					uid: 0,
					text: 'dummy message for deconnection',
				})
			}
			/* ^ a virer quand le back sera sur JWT 
				A changer de useEffect quand il n'y aura
				plus a envoyer de messages					*/
			
			set_current_chan((prev: ChanAndMessage | DirectMessage) => ({
				...prev,
				chan: {
					...(prev as ChanAndMessage).chan,
					members: (prev as ChanAndMessage).chan.members
						.filter((user: number) => user !== data.target_id)
				}
			}))

			let tmp_chan = all_channels.find((c: Channel) => c.name === data.name)

			if (typeof tmp_chan === 'undefined')
				return;	

			(tmp_chan as Channel).members = (tmp_chan as Channel).members.filter((user: number) => 
				user !== data.target_id
			)

			set_all_channels((prev: Channel[]) => {
				let ret = prev.filter((c: Channel) => 
					c.name !== data.name
				)
				ret.push((tmp_chan as Channel))
				return ret;
			})
		}

		const handleBan = (data: any) => {
			console.log('inside handleban:', data)
			if (data.user_id !== current_user.id) {
				socket_chat.emit('message', {
					name: data.name,
					sender_id: current_user.id,
					sender_name: current_user.name,
					uid: 0,
					text: 'dummy message for deconnection',
				})
			}
			/* ^ a virer quand le back sera sur JWT 
				A changer de useEffect quand il n'y aura
				plus a envoyer de messages					*/
			
			set_current_chan((prev: ChanAndMessage | DirectMessage) => ({
				...prev,
				chan: {
					...(prev as ChanAndMessage).chan,
					members: (prev as ChanAndMessage).chan.members
						.filter((user: number) => user !== data.target_id),
					banned: [...(prev as ChanAndMessage).chan.banned, data.target_id],
				}
			}))

			let tmp_chan = all_channels.find((c: Channel) => c.name === data.name)

			if (typeof tmp_chan === 'undefined')
				return;	

			(tmp_chan as Channel).members = (tmp_chan as Channel).members.filter((user: number) => 
				user !== data.target_id
			);
			(tmp_chan as Channel).banned.push(data.target_id)

			set_all_channels((prev: Channel[]) => {
				let ret = prev.filter((c: Channel) => 
					c.name !== data.name
				)
				ret.push((tmp_chan as Channel))
				return ret;
			})
		}

		socket_chat.on('kick', handleKick)
		socket_chat.on('ban', handleBan)
	}, [current_chan, set_current_chan,
		current_user, set_current_user,
		all_channels, set_all_channels])

	if (typeof current_user.channels !== 'undefined'
	&& typeof all_channels[0] !== 'undefined'
	&& (chanOfUser.length == 0 && current_user.channels.length > 0))
	{
		setChanOfUser(names_to_channel(all_channels, current_user.channels))
	}

	let direct_messages = dm_of_user(current_user);

	function changeChannelOrDm(param: Channel | DirectMessage): void {
		if (typeof (param as Channel).operators !== 'undefined')
		{
			if (typeof (current_chan as ChanAndMessage).chan !== 'undefined'){
				socket_chat.emit('leave', {
					name: (current_chan as ChanAndMessage).chan.name,
					user_id: current_user.id,
				})
			}

			socket_chat.emit('join', {
				name: (param as Channel).name,
				user_id: current_user.id,
			});

			set_current_chan({
				chan: param as Channel,
				msg: [],
			})
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

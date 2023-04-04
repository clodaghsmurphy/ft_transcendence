import React, { useEffect, useState, useContext } from 'react'
import NavBar from '../Components/NavBar'
import Messages from './Messages'
import '../Home/Dashboard.css'
import './Chat.css'
import { User_in_group } from './UserGroup'
import User, { id_to_user } from '../utils/User'
import { Channel, MUTE, MessageData, names_to_channel } from './Channels'
import io, { Socket } from 'socket.io-client'
import { DirectMessage, dm_of_user } from './DirectMessage'
import { AuthContext } from '../../App'
import { group_message, Password, sanitizeString, users_message } from './ChatUtils'
import PopupJoinChannel from './PopupJoinChannel'
import axios, { AxiosResponse, AxiosError } from 'axios'

export type ChanAndMessage = {
	chan: Channel,
	msg: MessageData[],
}

export let socket_chat: Socket


function Chat()
{
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { state, dispatch } = useContext(AuthContext);
	let [all_users, set_all_users] = useState([] as User[])
	let [all_channels, set_all_channels] = useState([] as Channel[])
	let [current_user, set_current_user] = useState({} as User)
	let [current_chan, set_current_chan] = useState({} as ChanAndMessage | DirectMessage)
	let [chanOfUser, setChanOfUser] = useState([] as Channel[])
	
	
	useEffect(() => {
		// socket_chat.disconnect()
		socket_chat = io(`http://${window.location.hostname}:8080/channel`,
		{
			extraHeaders: {
				Authorization: "Bearer " + localStorage.getItem('token')
			}
		})
	}, [])

	// socket_chat.on('connect', () => {
	// 	console.log('CONNECTED', socket_chat.connected)
	// })
	
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

	}, [state.user.id]);

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

		const handleMute = (data: any) => {
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
			let chan_name = data.name;
			if (typeof all_channels.find((chan: Channel) => 
					chan.name === chan_name
				) === 'undefined') // Si le chan existe pas
			{
				fetch('/api/channel/info/' + sanitizeString(chan_name))
				.then((response) => {
					response.json()
						.then((data) => {
							set_all_channels((prev: Channel[]) => [...prev, data])
							setChanOfUser((prev: Channel[]) => [...prev, data])
							fetch('/api/channel/' + sanitizeString(data.name) + '/messages/')
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
	}, [all_channels, set_all_channels,
		current_user, set_current_user,
		all_users, set_all_users])

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
	&& (chanOfUser.length === 0 && current_user.channels.length > 0))
	{
		setChanOfUser(names_to_channel(all_channels, current_user.channels))
	}

	let direct_messages = dm_of_user(current_user);

	function changeChannelOrDm(param: Channel | DirectMessage): void {
		if (typeof (param as Channel).operators !== 'undefined')
		{
			if (typeof (current_chan as ChanAndMessage).chan !== 'undefined' &&
				(current_chan as ChanAndMessage).chan.name !== (param as Channel).name) {
				socket_chat.emit('leave', {
					name: (current_chan as ChanAndMessage).chan.name,
					user_id: current_user.id,
				})
			}

			socket_chat.emit('join', {
				name: (param as Channel).name,
				user_id: current_user.id,
			}, (data: any) => {
				console.log('emitted join, ret:', data)
			});

			set_current_chan({
				chan: param as Channel,
				msg: [],
			})
			axios.get('/api/channel/' + sanitizeString((param as Channel).name) + '/messages/')
				.then((response: AxiosResponse) => {
					console.log(response.data)
					set_current_chan({
						chan: param as Channel,
						msg: response.data as MessageData[],
					})
				})
		}
		if (typeof (param as DirectMessage).messages !== 'undefined')
			set_current_chan(param as DirectMessage)
	}

	const leaveChannel = (data: any) => {
		let new_channels = all_channels
		let new_curr_user = current_user

		new_channels = new_channels
			.filter((c: Channel) => c.name !== data.name)
		new_channels.push(data as Channel)
		set_all_channels(new_channels)

		new_curr_user.channels = new_curr_user.channels
			.filter((name: string) => name !== data.name)
		set_current_user(new_curr_user)
	}

	return (
		<div className="dashboard">
        <NavBar /> 
        <main className="page-wrapper">
            <div className="channels">
				<h1>Messages</h1>

				<div className='bar'></div>
					<div className='lists'>
						<div style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							height: '64px',
						}}>
							<h1>Group chats</h1>
							{PopupJoinChannel(chanOfUser, current_user,
											changeChannelOrDm, setChanOfUser)}
						</div>
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
					all_users, current_user, set_current_chan,
					setChanOfUser, leaveChannel)}
			</div>

            <div className="group-members">
				<h1>Group users</h1>
				
				<div className='user-holder'>
					{User_in_group(all_users, current_user, (current_chan as ChanAndMessage).chan)}
				</div>

				{Password(current_user, current_chan)}
			</div>
        </main>
        </div>
    );
}

export default Chat;

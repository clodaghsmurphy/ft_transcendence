import React, { useEffect, useState, useContext } from 'react'
import NavBar from '../Components/NavBar'
import Messages from './Messages'
import '../Home/Dashboard.css'
import './Chat.css'
import { User_in_group } from './UserGroup'
import User, { id_to_user } from '../utils/User'
import { Channel, MUTE, MessageData, names_to_channel } from './Channels'
import io, { Socket } from 'socket.io-client'
import { DirectMessage } from './DirectMessage'
import { AuthContext } from '../../App'
import { group_message, Password, refresh_button, sanitizeString, users_message } from './ChatUtils'
import PopupJoinChannel from './PopupJoinChannel'
import axios, { AxiosResponse, AxiosError } from 'axios'
import { handleBan, handleCreate, handleJoin, handleKick, handleMakeop, handleMessage } from './SocketEvents'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './ToastifyFix.css'

export const CHANNEL	= false
export const DM 		= true

export type ChanAndMessage = {
	chan: Channel,
	msg: MessageData[],
}

export type CurrentChan = {
	chan?: Channel,
	user?: number,	// ID if its a DM
	msg: MessageData[],
	type: boolean,	// DM or CHANNEL
}

export let socket_chan: Socket
export let socket_dm: Socket

function Chat()
{
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { state, dispatch } = useContext(AuthContext);
	const user_id = Number(state.user.id)
	let [all_users, set_all_users] = useState([] as User[])
	let [all_channels, set_all_channels] = useState([] as Channel[])
	let [current_user, set_current_user] = useState({} as User)
	let [current_chan, set_current_chan] = useState({} as CurrentChan)
	let [chanOfUser, setChanOfUser] = useState([] as Channel[])
	let [dms, set_dms] = useState([] as DirectMessage[])
	
	useEffect(() => {
		document.title = 'Chat';
		axios.get('/api/user/info')
			.then((response: AxiosResponse) => {
					set_all_users(response.data as User[])
					set_current_user(id_to_user(response.data as User[], user_id))
				})
			.catch((err: AxiosError) => {
				toast.error('Error fetching users');
			})
		
		axios.get('/api/channel/info')
			.then((response: AxiosResponse) => {
					set_all_channels(response.data as Channel[])
			})
			.catch((err: AxiosError) => {
				toast.error('Error fetching channels');
			})
		
		axios.get('/api/dm')
			.then((response: AxiosResponse) => {
				set_dms(response.data)
			})
			.catch((err: AxiosError) => {
				toast.error('Error fetching DMs');
			})
		
		socket_chan = io(`http://${window.location.hostname}:8080/channel`,
		{
			extraHeaders: {
				Authorization: "Bearer " + localStorage.getItem('token')
			}
		})

		socket_dm = io(`http://${window.location.hostname}:8080/dm`,
		{
			extraHeaders: {
				Authorization: "Bearer " + localStorage.getItem('token')
			}
		})

		socket_chan.emit('ping')

		socket_chan.on('exception', (data: any) => {
			console.log('chan:', data)
		})
		socket_dm.on('exception', (data: any) => {
			console.log('dm:', data)
		})
	}, [])

	useEffect(() => {
		handleBan({all_channels, set_current_chan, 
				set_all_channels, current_chan,
				current_user, setChanOfUser});
	}, [all_channels, set_current_chan,
		set_all_channels, current_chan,
		current_user, setChanOfUser])

	useEffect(() => {
		handleMessage({current_chan, set_current_chan})
		handleMakeop({current_chan, set_current_chan})
	}, [current_chan, set_current_chan])

	useEffect(() => {
		handleJoin({set_current_chan, set_all_channels, setChanOfUser, all_channels})
	}, [set_current_chan, set_all_channels, setChanOfUser, all_channels])

	useEffect(() => {
		handleKick({set_current_user, all_channels,
					set_all_channels, set_current_chan,
					current_user, setChanOfUser})
	}, [set_current_user, all_channels,
		set_all_channels, set_current_chan,
		current_user, setChanOfUser])
	
	useEffect(() => {
		handleCreate({all_channels, set_all_channels, setChanOfUser})
	}, [all_channels, set_all_channels, setChanOfUser])

	if (typeof current_user.channels !== 'undefined'
	&& typeof all_channels[0] !== 'undefined'
	&& (chanOfUser.length === 0 && current_user.channels.length > 0))
	{
		setChanOfUser(names_to_channel(all_channels, current_user.channels))
	}


	function changeChannelOrDm(param: Channel | DirectMessage): void {
		const is_chan = typeof (param as Channel).operators !== 'undefined'
		const is_dm = typeof (param as DirectMessage).id !== 'undefined'

		if (typeof current_chan.msg === 'undefined') {
			if (is_chan) {
				socket_chan.emit('join', {
					name: (param as Channel).name,
					user_id: current_user.id,
				});
				axios.get('/api/channel/' + sanitizeString((param as Channel).name) + '/messages/')
				.then((response: AxiosResponse) => {
					set_current_chan({
						chan: param as Channel,
						msg: response.data as MessageData[],
						type: CHANNEL
					})
				})
				.catch((err: AxiosError) => {
					toast.error('Error fetching channel ' + sanitizeString((param as Channel).name));
				})
			}
			if (is_dm) {
				socket_dm.emit('join', {
					receiver_id: (param as DirectMessage).id
				});
				axios.get('/api/dm/' + (param as DirectMessage).id)
				.then((response: AxiosResponse) => {
					set_current_chan({
						user: (param as DirectMessage).id,
						msg: response.data as MessageData[],
						type: DM
					})
				})
				.catch((err: AxiosError) => {
					toast.error('Error fetching DM with user ' + (param as DirectMessage).id);
				})
			}
			return
		}

		if (current_chan.type === CHANNEL) {
			if (current_chan.chan!.name !== (param as Channel).name) {
				socket_chan.emit('leave', {
				name: current_chan.chan!.name,
				user_id: current_user.id,
			})}
		} else {
			socket_dm.emit('leave', {
				receiver_id: current_chan.user
			})
		}

		if (is_chan)
		{
			param = param as Channel

			if (current_chan.chan?.name === (param as Channel).name)
				return
			
				socket_chan.emit('join', {
				name: param.name,
				user_id: current_user.id,
			});

			set_current_chan({
				chan: param,
				msg: [],
				type: CHANNEL,
			})
			axios.get('/api/channel/' + sanitizeString(param.name) + '/messages/')
				.then((response: AxiosResponse) => {
					set_current_chan({
						chan: param as Channel,
						msg: response.data as MessageData[],
						type: CHANNEL
					})
				})
				.catch((err: AxiosError) => {
					toast.error('Error fetching channel ' + (param as DirectMessage).id);
				})
		}
		else if (is_dm) {
			const target_id = (param as DirectMessage).id

			axios.get('/api/dm/' + target_id)
				.then((response: AxiosResponse) => {
					socket_dm.emit('join', {
						receiver_id: target_id
					})
					set_current_chan({
						user: target_id,
						type: DM,
						msg: response.data as MessageData[],
					})
				})
				.catch((err: AxiosError) => {
					toast.error('Error fetching DM with user ' + (param as DirectMessage).id);
				})
		}
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

	function refresh_function(to_refresh: string): void {
		if (to_refresh === 'channels') {
			
		}
	}

	return (
		<div className="dashboard">
        <NavBar /> 
        <main className="page-wrapper">
				<ToastContainer 
					theme='colored'
				/>
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
							<h1>Channels</h1>
							{PopupJoinChannel(chanOfUser, current_user,
											changeChannelOrDm, setChanOfUser)}
							{refresh_button('channels', refresh_function)}
						</div>
						<div className='lists-holder'>
							{group_message(chanOfUser,
								changeChannelOrDm, all_users, current_user)}
						</div>
					</div>

					<div className='bar'></div>
					<div className='lists'>
						<h1>DM</h1>
						<div className='lists-holder'>
							{users_message(dms, all_users,
									current_user, changeChannelOrDm,
									dms, set_dms)}
						</div>
						<div className='channels-holder'></div>
					</div>
				<div className='channels-holder'></div>
			</div>

            <div className="chatbox">
				{Messages(current_chan,
					all_users, current_user, set_current_chan,
					setChanOfUser, leaveChannel)}
			</div>

            <div className="group-members">
				<h1>Users</h1>
				
				<div className='user-holder'>
					{User_in_group(all_users, current_user, current_chan)}
				</div>

				{Password(current_user, current_chan)}
			</div>
        </main>
        </div>
    );
}

export default Chat;
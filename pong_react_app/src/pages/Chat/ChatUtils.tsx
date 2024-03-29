import { Channel, names_to_channel } from "./Channels";
import { DirectMessage } from "./DirectMessage";
import PopupCreateChannel from "./PopupCreateChannel";
import PopupAddDirect from "./PopupAddDirect";
import User, { id_to_user } from "../utils/User";
import plus_sign from '../../media/white_plus.png'
import group_img from '../../media/group.png'
import React, { useRef } from 'react'
import { ChanAndMessage, CurrentChan, DM, socket_chan } from "./Chat"
import refresh_icon from '../../media/refresh_icon.png'
import { ChatVariables } from "./SocketEvents";
import axios, { AxiosResponse, AxiosError } from "axios";
import { toast } from "react-toastify";


const { v4: uuidv4 } = require('uuid');

export function chat_button(name: string, img: string,
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
					<h2 style={{
						marginTop: 'auto',
						marginBottom: 'auto',
						fontSize: '1.5rem',
						height: '2.25rem',
					}}>
						{name}
					</h2>
			</button>
		</div>
	);
}

export function users_message(message_data: DirectMessage[], all_users: User[],
		current_user: User, click_handler: (param: Channel | DirectMessage) => void,
		dm: DirectMessage[], set_dms: React.Dispatch<React.SetStateAction<DirectMessage[]>>,
		refresh: () => void)
{
	let ret: JSX.Element[] = [];

	for (const dm of message_data) {
		if (typeof dm === 'undefined')
			continue
		let user = id_to_user(all_users, dm.id)

		if (user.id != dm.id || user.id === -1) {
			refresh()
			continue
		}

		ret.push(chat_button(user.name, user.avatar, click_handler, dm));
	}
	ret.push(PopupAddDirect(all_users, current_user, click_handler,
			dm, set_dms))
	return ret;
}

export function add_group(): JSX.Element {
	return (
		<div className='chat-button-wrapper' key={uuidv4()}>
			<button className='chat-button'>
				<div className='group-add'>
					<img src={plus_sign} alt='plus'/>
					<h1>Create a group</h1>
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

export function group_message(chan_data: Channel[],
	click_handler: (chan: Channel | DirectMessage) => void,
	every_user: User[], current_user: User)
{
	let ret: JSX.Element[] = [];

	for (const chan of chan_data) {
		ret.push(chat_button(chan.name, group_img, click_handler, chan));
	}
	ret.push(PopupCreateChannel(every_user, current_user))
	return ret;
}


export function Password(current_user: User, current_chan: CurrentChan): JSX.Element {
	let pass_ref = useRef<HTMLInputElement | null>(null)

	if (current_chan.type === DM)
		return <div key={uuidv4()}></div>

	current_chan.chan = current_chan.chan!

	if (typeof current_chan.chan === 'undefined')
		return <div key='nothing'/>

	if (current_chan.chan.owner !== current_user.id)
		return <div key='nothing'/>

	function changePassword(name: string) {
		if (pass_ref.current!.value.length === 0)
			return
		socket_chan.emit('password', {
			name: name,
			user_id: current_user.id,
			password: pass_ref.current!.value,
		})
		pass_ref.current!.value = ''
	}

	function clearPassword(name: string) {
		socket_chan.emit('password', {
			name: name,
			user_id: current_user.id,
		})
	}

	return (
		<div className='change-password-holder'>
			<div className='bar'/>
			<h3 style={{
				textAlign: 'center',
				color: 'white'
			}}>Change password:</h3>
			<div style={{
				display: 'flex',
				flexDirection: 'row',
			}}>
				<input 
					type='text'
					placeholder='password'
					className='input-password'
					ref={pass_ref}
				/>
				<button className='pastille-ok'
					onClick={() => changePassword(
						(current_chan as ChanAndMessage).chan.name
					)}>
						✓
				</button>
				<button className='pastille-clear'
					onClick={() => clearPassword(
						(current_chan as ChanAndMessage).chan.name
					)}>
						🗑
				</button>
			</div>
		</div>
	)
}

export function sanitizeString(str: string): string {
	let sanitizedStr: string = str.replace(/[^\w\s-]/g, "_");
	
	sanitizedStr = sanitizedStr.replace(/^[ \s_]+|[ \s_]+$/g, "")

	return sanitizedStr;
}

export function refresh_button(to_refresh: string, fnc: (s: string) => void): JSX.Element {
	return (
		<button
			className="refresh-button"
			onClick={() => fnc(to_refresh)}>
			<img src={refresh_icon} />
		</button>
	)
}

export function refresh_data(vars: ChatVariables, user_id: number) {
	if (!vars.set_all_channels || !vars.set_all_users ||
		!vars.set_dms || !vars.set_current_user ||
		!vars.current_user || !vars.setChanOfUser ||
		!vars.all_channels) {
			return
		}
	
	let ret: ChatVariables = {}
	
	const is_not_the_first_time_entering_the_function =
		typeof vars.current_user.friend_users !== 'undefined'
	
	axios.get('/api/user/info')
		.then((response: AxiosResponse) => {
				vars.set_all_users!(response.data as User[])
				vars.set_current_user!(id_to_user(response.data as User[], user_id)) //safe puisqu'on existe forcement

				ret.all_users = response.data
				ret.current_user = id_to_user(response.data as User[], user_id)

				let usr = id_to_user(response.data as User[], user_id)
				axios.get('/api/channel/info')
					.then((response: AxiosResponse) => {
							vars.set_all_channels!(response.data as Channel[])
							vars.setChanOfUser!(names_to_channel(response.data as Channel[],
								usr.channels))
							
							ret.all_channels = response.data
							ret.chanOfUser = names_to_channel(response.data as Channel[],
								usr.channels)
					})
					.catch((err: AxiosError) => {
						toast.error('Error fetching channels');
					})
			})
		.catch((err: AxiosError) => {
			toast.error('Error fetching users');
		})
	
	axios.get('/api/dm')
		.then((response: AxiosResponse) => {
			vars.set_dms!(response.data)
			ret.dms = response.data
		})
		.catch((err: AxiosError) => {
			toast.error('Error fetching DMs');
		})
	
	
	if (is_not_the_first_time_entering_the_function) {
		toast.success('Refreshed data')
		return {}
	}
	return ret;
}
  
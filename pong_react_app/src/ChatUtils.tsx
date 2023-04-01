import { Channel } from "./Channels";
import { DirectMessage, dm_betweeen_two_users } from "./DirectMessage";
import PopupAddChannel from "./PopupAddChannel";
import PopupAddDirect from "./PopupAddDirect";
import User, { id_to_user } from "./User";
import plus_sign from './media/white_plus.png'
import group_img from './media/group.png'
import { useRef } from 'react'
import { ChanAndMessage, socket_chat } from "./Chat";

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

		ret.push(chat_button(user.name, user.avatar, click_handler, direct));
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

export function group_message(chan_data: Channel[],
	click_handler: (chan: Channel | DirectMessage) => void,
	every_user: User[], current_user: User)
{
	let ret: JSX.Element[] = [];

	for (const chan of chan_data) {
		ret.push(chat_button(chan.name, group_img, click_handler, chan));
	}
	ret.push(PopupAddChannel(every_user, current_user))
	return ret;
}


export function Password(current_user: User, current_chan: ChanAndMessage | DirectMessage): JSX.Element {
	let pass_ref = useRef<HTMLInputElement | null>(null)

	if (typeof (current_chan as ChanAndMessage).chan === 'undefined')
		return <div key={uuidv4()}></div>

	if ((current_chan as ChanAndMessage).chan.owner !== current_user.id)
		return <div key={uuidv4()}></div>

	function changePassword() {
		socket_chat.emit('password', {
			user_id: current_user.id,
			password: pass_ref.current!.value,
		})
		pass_ref.current!.value = ''
	}

	function clearPassword() {
		socket_chat.emit('password', {
			user_id: current_user.id,
			password: '',
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
					onClick={() => changePassword()}>
						✓
				</button>
				<button className='pastille-clear'
					onClick={() => clearPassword()}>
						🗑
				</button>
			</div>
		</div>
	)
}
import Button from '@mui/material/Button'
import React, { useRef } from 'react'
import { Avatar, ButtonGroup } from '@mui/material'
import User, { id_to_user } from './User'
import { Link } from 'react-router-dom';
import { Channel } from './Channels';
import { DirectMessage, dm_of_user } from './DirectMessage';
import { socket_chat } from './Chat';

const { v4: uuidv4 } = require('uuid');

export function User_in_group(every_user: User[], current_user: User, chan: Channel | DirectMessage): JSX.Element[] {
	let ret: JSX.Element[] = []
	let muteRef = useRef<HTMLInputElement | null>(null)


	if (typeof current_user === 'undefined' ||
		typeof chan === 'undefined')
		return [<div key='no-users-in-group' className='no-users'>No user found</div>]


	if (typeof (chan as DirectMessage).users !== 'undefined') {
		return user_in_dm(every_user, current_user, chan as DirectMessage);
	}

	chan = chan as Channel

	if (typeof chan.operators === 'undefined')
	{
		return ret
	}

	const curr_is_op = chan.operators.includes(current_user.id)

	if (curr_is_op)
		ret.push(<div style={{
			display: 'flex',
			flexDirection: 'row',
			gap: '5px',
		}} key={uuidv4()}>
			<h3 style={{
				flex: '0',
				minWidth: 'calc(5 * 0.75rem)',
				marginRight: '0',
				color: 'white',
			}}>Mute:</h3>
			<input ref={muteRef}
					type='text'
					className='mute-input'
					placeholder='Seconds...'
					style={{
						marginLeft: '0',
				}}/> 
		</div>)

	for (const user of chan.members) {
		const target_is_op = chan.operators.includes(user)
		const target_is_owner = chan.owner === user

		if (user != current_user.id) {
			if (curr_is_op && !target_is_owner)
				ret.push(Button_op(id_to_user(every_user, user),
					target_is_op, current_user, chan, muteRef))
			else
				ret.push(button_not_op(id_to_user(every_user, user), target_is_op))
		}
	}
	if (ret.length === 0) {
		return [<div key='no-users-in-group' className='no-users'>No users</div>]
	}
	return ret
}

function user_in_dm(every_user: User[], current_user: User, dm: DirectMessage): JSX.Element[] {
	let ret: JSX.Element[] = []

	for (const user of dm.users) {
		if (user != current_user.id) {
			ret.push(button_not_op(id_to_user(every_user, user), false))
		}
	}
	return ret
}

function button_not_op(user: User, is_op: boolean): JSX.Element {	
	return (
		<div className='group-members-button-wrapper' key={uuidv4()}>
			<div className='group-members-button'>
				<img src={user.avatar} alt={user.name}
					style={{"marginBottom": "auto",
						"marginTop": "auto"}}/>
				<div style={{
					"display": "flex",
					"flexDirection": "column",
					"margin": "0",
					"alignItems": "center",
					paddingTop: "2rem"
				}}>
					<div className='group-members-button-text'>
						<Link to={"/stats/" + user.name}
							className='group-member-button-link'
							style={{
								"textAlign": "center",
								"width": "100%",
								"color": (is_op ? "yellow" : "white")
							}}>
							{user.name}
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

function Button_op(user: User, is_op: boolean, current_user: User, chan: Channel,
	ref: React.MutableRefObject<HTMLInputElement | null>): JSX.Element {

	let mute_duration: string[] | null = null;
	if (ref.current) {
		mute_duration = ref.current!.value
		.match(/^\s*(\d+)\s*(s|sec|second|seconds)\s*$/i)
		console.log('YAAAAAAAAAAAAAa')
	}
			
	function emit_kick() {
		socket_chat.emit('kick', {
			name: chan.name,
			user_id: current_user.id,
			target_id: user.id,
		})
	}

	function emit_ban() {
		socket_chat.emit('ban', {
			name: chan.name,
			user_id: current_user.id,
			target_id: user.id,
		})
	}

	function emit_mute() {
		console.log(mute_duration)
		if (mute_duration) {
			let duration = parseInt(mute_duration[0])
			if (isNaN(duration))
				duration = 60
			console.log('duration?', duration)
			socket_chat.emit('mute', {
				name: chan.name,
				user_id: current_user.id,
				target_id: user.id,
				mute_duration: duration,
			})
		}
	}

	function emit_makeop() {
		socket_chat.emit('makeop', {
			name: chan.name,
			user_id: current_user.id,
			target_id: user.id,
		})
	}

	return (
		<div className='group-members-button-wrapper' key={uuidv4()}>
			<div className='group-members-button'>
				<img src={user.avatar} alt={user.name}
					style={{"marginBottom": "auto",
						"marginTop": "auto"}}/>
				<div style={{
					"display": "flex",
					"flexDirection": "column",
					"margin": "0",
					"alignItems": "center",
					paddingTop: "0.5rem"
				}}>
					<div className='group-members-button-text'>
						<Link to={"/stats/" + user.name}
							className='group-member-button-link'
							style={is_op ? {
								color: 'yellow',
							} : {
								"width": "100%",
								"color": 'white',
							}}>
							{user.name}
						</Link>
					</div>
					<div style={{
						"display": "flex",
						"flexDirection": "row",
						"alignItems": "center"
					}}>
						<button id='kick-button'
							onClick={() => emit_kick()}>
								Kick
						</button>
						<button id='ban-button'
							onClick={() => emit_ban()}>
								Ban
						</button>
					</div>
					<div style={{
						"display": "flex",
						"flexDirection": "row",
						"alignItems": "center",
						paddingTop: '5px',
					}}>
						<button id='mute-button'
							onClick={() => emit_mute()}>
								Mute
						</button>
						<button id='makeop-button'
							onClick={() => emit_makeop()}>
								OP
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
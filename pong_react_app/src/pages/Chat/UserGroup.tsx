import React, { useRef } from 'react'
import User, { id_to_user } from '../utils/User'
import { Link } from 'react-router-dom';
import { Channel } from './Channels';
import { DirectMessage } from './DirectMessage';
import { CurrentChan, DM, socket_chan } from './Chat';

const { v4: uuidv4 } = require('uuid');

export function User_in_group(every_user: User[], current_user: User, current_chan: CurrentChan): JSX.Element[] {
	let ret: JSX.Element[] = []
	let muteRef = useRef<HTMLInputElement | null>(null)

	if (typeof current_user === 'undefined' ||
		typeof current_chan === 'undefined')
		return [<div key='no-users-in-group' className='no-users'>No user found</div>]


	if (current_chan.type === DM) {
		return [user_in_dm(every_user, current_user, {
			id: current_chan.user!,
			msg: current_chan.msg,
		})];
	}

	current_chan.chan = current_chan.chan!


	if (typeof current_chan.user === 'undefined' &&
		typeof current_chan.chan?.operators === 'undefined')
	{
		return ret
	}

	function emit_mute(user: User) {
		let mute_duration: string[] | null = null;
		if (muteRef.current) {
			mute_duration = muteRef.current!.value
			.match(/^\s*(\d+)\s*(s|sec|second|seconde|seconds|secondes)?\s*$/i)
		}
		if (mute_duration || muteRef.current?.value.length === 0) {
		let duration: number
			if (mute_duration)
				duration = parseInt(mute_duration[0])
			else
				duration = NaN
			if (isNaN(duration))
				duration = 60
			socket_chan.emit('mute', {
				name: (current_chan.chan as Channel).name,
				user_id: current_user.id,
				target_id: user.id,
				mute_duration: duration,
			})
		}
	}

	const curr_is_op = current_chan.chan.operators.includes(current_user.id)

	if (curr_is_op)
		ret.push(<div style={{
			display: 'flex',
			flexDirection: 'row',
			gap: '5px',
			minHeight: '28px',
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

	for (const user of current_chan.chan.members) {
		const target_is_op = current_chan.chan.operators.includes(user)
		const target_is_owner = current_chan.chan.owner === user

		if (user !== current_user.id) {
			if (curr_is_op && !target_is_owner)
				ret.push(Button_op(id_to_user(every_user, user),
					target_is_op, current_user, current_chan.chan, emit_mute))
			else
				ret.push(button_not_op(id_to_user(every_user, user), target_is_op))
		}
	}
	if (ret.length === 0 || (ret.length === 1 && curr_is_op)) {
		return [<div key='no-users-in-group' className='no-users'>No users</div>]
	}

	console.log(ret.length)
	return ret
}

function user_in_dm(every_user: User[], current_user: User, dm: DirectMessage) {
	
	return button_not_op(id_to_user(every_user, dm.id), false)
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
						<Link to={"/stats/" + user.id}
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
	fnc: (user: User) => void): JSX.Element {
			
	function emit_kick() {
		socket_chan.emit('kick', {
			name: chan.name,
			user_id: current_user.id,
			target_id: user.id,
		})
	}

	function emit_ban() {
		socket_chan.emit('ban', {
			name: chan.name,
			user_id: current_user.id,
			target_id: user.id,
		})
	}

	function emit_makeop() {
		socket_chan.emit('makeop', {
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
						<Link to={"/stats/" + user.id}
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
							onClick={() => fnc(user)}>
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
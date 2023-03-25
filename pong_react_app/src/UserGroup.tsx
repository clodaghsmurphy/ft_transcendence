import Button from '@mui/material/Button'
import React from 'react'
import { Avatar, ButtonGroup } from '@mui/material'
import User, { id_to_user } from './User'
import { Link } from 'react-router-dom';
import { Channel } from './Channels';
import { DirectMessage } from './DirectMessage';

const { v4: uuidv4 } = require('uuid');

export function user_in_group(every_user: User[], current_user: User, chan: Channel | DirectMessage): JSX.Element[] {
	let ret: JSX.Element[] = []

	if (typeof current_user === 'undefined' ||
		typeof chan === 'undefined')
		return [<div key={uuidv4()} className='no-users'>No user found</div>]


	if (typeof (chan as DirectMessage).users !== 'undefined') {
		return user_in_dm(every_user, current_user, chan as DirectMessage);
	}

	chan = chan as Channel

	if (typeof chan.operators === 'undefined')
	{
		return ret
	}

	const curr_is_op = chan.operators.includes(current_user.id)

	for (const user of chan.members) {
		if (user != current_user.id) {
			if (curr_is_op && !chan.operators.includes(user))
				ret.push(button_op(id_to_user(every_user, user), chan.operators.includes(user)))
			else
				ret.push(button_not_op(id_to_user(every_user, user), chan.operators.includes(user)))
		}
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
	let pastille: JSX.Element

	pastille = <div className='pastille'></div>
	if (!is_op)
		pastille = <></>
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

function button_op(user: User, is_op: boolean): JSX.Element {
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
					paddingTop: "1rem"
				}}>
					<div className='group-members-button-text'>
						<Link to={"/stats/" + user.name}
							className='group-member-button-link'
							style={is_op ? {} : {
								"textAlign": "center",
								"width": "100%"
							}}>
							{user.name}
						</Link>
					</div>
					<div style={{
						"display": "flex",
						"flexDirection": "row",
						"alignItems": "center"
					}}>
						<button id='kick-button'>Kick</button>
						<button id='ban-button'>Ban</button>
					</div>
				</div>
			</div>
		</div>
	);
}
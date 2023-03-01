import Button from '@mui/material/Button'
import React from 'react'
import { Avatar, ButtonGroup } from '@mui/material'
import User, { name_to_user } from './User'
import { Link } from 'react-router-dom';
import { Channel } from './Channels';

const { v4: uuidv4 } = require('uuid');

export function user_in_group(every_user: User[], current_user: User, chan: Channel): JSX.Element[] {
	let ret: JSX.Element[] = []

	if (typeof current_user === 'undefined' || typeof chan.op === 'undefined' || chan.members.length === 0)
		return [<div key={uuidv4()} className='no-users'>No user found</div>]

	const curr_is_op = chan.op.includes(current_user.name)

	for (const user of chan.members) {
		if (user != current_user.name) {
			if (curr_is_op && !chan.op.includes(user))
				ret.push(button_op(name_to_user(every_user, user), chan.op.includes(user)))
			else
				ret.push(button_not_op(name_to_user(every_user, user), chan.op.includes(user)))
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
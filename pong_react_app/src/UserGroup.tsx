import Button from '@mui/material/Button'
import React from 'react'
import { Avatar, ButtonGroup } from '@mui/material'
import User from './User'

const { v4: uuidv4 } = require('uuid');

export function in_user_button_normal(user: User, is_op: boolean): JSX.Element {
	let head: JSX.Element;

	if (is_op) {
		head = (<h2 className='is_op'>
		{user.name}
		</h2>);
	} else {
		head = (<h2>
			{user.name}
		</h2>);
	}
	
	return (
		<div className='group-members-button' key={uuidv4()}>
			<Avatar src={user.avatar} alt={user.name}
				sx={{"marginBottom": "auto",
					"marginTop": "auto"}}/>

			<div className='group-members-button-text'>
				{head}

				<ButtonGroup size='small'
					sx={{"width": "90%", "overflow": "scroll"}}>
					<Button variant="contained" color='success' sx={{'textTransform': 'none'}}>
						Add
					</Button>
					<Button variant="contained" color='secondary' sx={{'textTransform': 'none'}}>
						Stats
					</Button>
					<Button variant="contained" color='error' sx={{'textTransform': 'none'}}>
						Block
					</Button>
				</ButtonGroup>
			</div>
		</div>
	);
}

export function in_user_button_blocked(user: User, is_op: boolean): JSX.Element {
	let head: JSX.Element;

	if (is_op) {
		head = (<h2 className='is_op'>
		{user.name}
		</h2>);
	} else {
		head = (<h2>
			{user.name}
		</h2>);
	}
	
	return (
		<div className='group-members-button' key={uuidv4()}
			style={{"borderColor": "red",
					"backgroundColor": "rgb(211, 47, 47)",
			}}>
			<Avatar src={user.avatar} alt={user.name}
				sx={{"marginBottom": "auto",
					"marginTop": "auto"}}/>

			<div className='group-members-button-text'>
				{head}

				<ButtonGroup size='small'
					sx={{"width": "90%", "overflow": "scroll"}}>
					<Button variant="contained" color='secondary' sx={{'textTransform': 'none'}}>
						Stats
					</Button>
					<Button variant="contained" color='warning' sx={{'textTransform': 'none'}}>
						Unblock
					</Button>
				</ButtonGroup>
			</div>
		</div>
	);
}

export function in_user_button_friend(user: User, is_op: boolean): JSX.Element {
	let head: JSX.Element;

	if (is_op) {
		head = (<h2 className='is_op'>
		{user.name}
		</h2>);
	} else {
		head = (<h2>
			{user.name}
		</h2>);
	}

	return (
		<div className='group-members-button' key={uuidv4()}
			style={{"borderColor": "green",
					"backgroundColor": "#2e7d32",
			}}>
			<Avatar src={user.avatar} alt={user.name}
				sx={{"marginBottom": "auto",
					"marginTop": "auto"}}/>

			<div className='group-members-button-text'>
				{head}

				<ButtonGroup size='small'
					sx={{"width": "90%", "overflow": "scroll"}}>
					<Button variant="contained" color='secondary'
						sx={{'textTransform': 'none'}}>
						Stats
					</Button>
					<Button variant="contained" color='warning'
						sx={{'textTransform': 'none'}}>
						Remove
					</Button>
				</ButtonGroup>
			</div>
		</div>
	);
}
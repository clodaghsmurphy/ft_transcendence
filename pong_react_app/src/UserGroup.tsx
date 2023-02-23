import Button from '@mui/material/Button'
import React from 'react'
import { Avatar, ButtonGroup } from '@mui/material'
import User from './User'
import { Link } from 'react-router-dom';

const { v4: uuidv4 } = require('uuid');

export function in_user_button_normal(user: User, is_op: boolean): JSX.Element {
	let head: JSX.Element;

	if (is_op) {
		head = (<Link to={"/stats/" + user.name}
		className='is_op group-member-button-link'>
		{user.name}
		</Link>);
	} else {
		head = (<Link to={"/stats/" + user.name}
			className='group-member-button-link'>
			{user.name}
		</Link>);
	}
	
	return (
		<div className='group-members-button' key={uuidv4()}>
			<img src={user.avatar} alt={user.name} />

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
		head = (<Link to={"/stats/" + user.name}
		className='is_op group-member-button-link'>
		{user.name}
		</Link>);
	} else {
		head = (<Link to={"/stats/" + user.name}
			className='group-member-button-link'>
			{user.name}
		</Link>);
	}
	
	return (
		<div className='group-members-button' key={uuidv4()}
			style={{"borderColor": "red",
					"backgroundColor": "rgb(211, 47, 47)",
			}}>
			<img src={user.avatar} alt={user.name}
				style={{"marginBottom": "auto",
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
		head = (<Link to={"/stats/" + user.name}
		className='is_op group-member-button-link'>
		{user.name}
		</Link>);
	} else {
		head = (<Link to={"/stats/" + user.name}
			className='group-member-button-link'>
			{user.name}
		</Link>);
	}

	return (
		<div className='group-members-button' key={uuidv4()}
			style={{"borderColor": "green",
					"backgroundColor": "#2e7d32",
			}}>
			<img src={user.avatar} alt={user.name}
				style={{"marginBottom": "auto",
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
import Button from '@mui/material/Button'
import React, { NamedExoticComponent } from 'react'
import { Avatar, Box, ButtonGroup } from '@mui/material'
import { ClassNames } from '@emotion/react';

export function in_user_button_normal(name: string, img: string, is_op: boolean): JSX.Element {
	let head: JSX.Element;

	if (is_op) {
		head = (<h2 className='is_op'>
		{name}
		</h2>);
	} else {
		head = (<h2>
			{name}
		</h2>);
	}
	
	return (
		<div className='group-members-button'>
			<Avatar src={img} alt={name}
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

export function in_user_button_blocked(name: string, img: string, is_op: boolean): JSX.Element {
	let head: JSX.Element;

	if (is_op) {
		head = (<h2 className='is_op'>
		{name}
		</h2>);
	} else {
		head = (<h2>
			{name}
		</h2>);
	}
	
	return (
		<div className='group-members-button'
			style={{"borderColor": "red",
					"backgroundColor": "rgb(211, 47, 47)",
			}}>
			<Avatar src={img} alt={name}
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

export function in_user_button_friend(name: string, img: string, is_op: boolean): JSX.Element {
	let head: JSX.Element;

	if (is_op) {
		head = (<h2 className='is_op'>
		{name}
		</h2>);
	} else {
		head = (<h2>
			{name}
		</h2>);
	}
	
	return (
		<div className='group-members-button'
			style={{"borderColor": "green",
					"backgroundColor": "#2e7d32",
			}}>
			<Avatar src={img} alt={name}
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
						Remove
					</Button>
				</ButtonGroup>
			</div>
		</div>
	);
}
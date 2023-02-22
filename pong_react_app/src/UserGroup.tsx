import Button from '@mui/material/Button'
import React, { NamedExoticComponent } from 'react'
import { Avatar } from '@mui/material'
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
		<Button variant='contained' color='primary'
			sx={{'textTransform': 'lowercase',
				'margin': '0 5% 0 5%', 'minHeight': '5rem'}}>
			<Avatar src={img} alt={name}/>

			{head}
		</Button>
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
		<Button variant='contained' color='error'
			sx={{'textTransform': 'lowercase',
				'margin': '0 5% 0 5%', 'minHeight': '5rem'}}>
			<Avatar src={img} alt={name}/>

			{head}
		</Button>
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
		<Button variant='contained' color='success'
			sx={{'textTransform': 'lowercase',
				'margin': '0 5% 0 5%', 'minHeight': '5rem'}}>
			<Avatar src={img} alt={name}/>

			{head}
		</Button>
	);
}
import React, { MouseEventHandler, useState } from 'react'
import TextField from '@mui/material/TextField'
import { List, ListItemButton, ListItemText } from '@mui/material';

const { v4: uuidv4 } = require('uuid');

export function SearchBar(every_user_name: string[], on_click_function:
		(str: string) => MouseEventHandler<HTMLButtonElement> | undefined): JSX.Element {
	let res:JSX.Element[] = [];
	let [list_users, setList_user] = useState([<div key={uuidv4}/>]);

	
	function updateList(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		let res: JSX.Element[];
		let key: number = 0;

		event.target.addEventListener("blur", () => resetList())

		if (event.target.value.length === 0) {
			res = [<div key={uuidv4}/>]
		} else {
			res = every_user_name.filter(str => str.includes(event.target.value)).map(
				filtered => 
					<button key={uuidv4()} onClick={() => on_click_function(filtered)}>
						{filtered}
					</button>
			)
		}
		setList_user(res)
	}

	function resetList() {
		if (list_users.length > 0)
		{
			setList_user([<div key={uuidv4()}/>])
		}
	}

	return (
		<div style={{
			"padding": "0", "margin": "0", "position": "relative",
			"overflow": "visible", "width": "100%"
		}}>
			<TextField variant='standard' size='small' label='Search'
				sx={{'width': '90%', 'marginLeft': '0'
				, 'marginRight': '0'}}
				onChange={(e) => updateList(e)}/>
			<div className="list-container">
				{list_users}
			</div>
		</div>
	);
}
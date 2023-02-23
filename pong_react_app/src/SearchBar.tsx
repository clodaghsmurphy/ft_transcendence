import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import { List, ListItemButton, ListItemText } from '@mui/material';

const { v4: uuidv4 } = require('uuid');

export function SearchBar(every_user_name: string[]): JSX.Element {
	let res:JSX.Element[] = [];
	let [list_users, setList_user] = useState([<></>]);

	
	function updateList(event: React.ChangeEvent<HTMLInputElement>) {
		let res: JSX.Element[];
		let key: number = 0;

		event.target.addEventListener("blur", resetList)

		if (event.target.value.length === 0) {
			res = [<></>]
		} else {
			res = every_user_name.filter(str => str.includes(event.target.value)).map(
				filtered => 
					<button key={uuidv4()}>
						{filtered}
					</button>
			)
		}
		setList_user(res)
	}

	function resetList() {
		setList_user([<></>])
	}

	return (
		<div style={{
			"padding": "0", "margin": "0", "position": "relative",
			"overflow": "visible", "width": "100%"
		}}>
			<TextField variant='standard' size='small' label='Search'
				sx={{'width': '90%', 'marginLeft': '0'
				, 'marginRight': '0'}}
				onChange={updateList}/>
			<div className="list-container">
				{list_users}
			</div>
		</div>
	);
}
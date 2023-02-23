import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import { List, ListItemButton, ListItemText } from '@mui/material';

function matching_username(every_user_name: string[], curr: string): string[] {
	let ret: string[] = [];

	if (!curr) {
		return every_user_name;
	}
	return every_user_name.filter(truc => truc.includes(curr));
}

export function SearchBar(every_user_name: string[]): JSX.Element {
	let list_element:JSX.Element[] = [];
	let [query, setQuery] = useState("");
	
	return (
		<div style={{
			"padding": "0", "margin": "0"
		}}>
			<TextField variant='standard' size='small' label='Search'
				sx={{'width': '90%', 'marginLeft': '0'
				, 'marginRight': '0'}}
				onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
					list_element = matching_username(every_user_name, event.target.value).map(name =>
						<ListItemButton>
							<ListItemText primary={name}>
							</ListItemText>
						</ListItemButton>
					)
					console.log(event.target.value)
					console.log(list_element)
				}}/>
			<List>
				<div className='test'></div>
				{list_element}
			</List>
		</div>
	);
}
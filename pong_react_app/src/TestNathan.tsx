import React, { useState } from 'react'
import { List, ListItem, TextField } from '@mui/material'

export default function TestNathan() {
	const [input, setInput] = useState([<></>]);

	const tab: string[] = [
		"nguiard",
		"clmurphy",
		"ple-lez",
		"adben-mc"
	]


	let res: JSX.Element[] = []

	function updateInput(event: React.ChangeEvent<HTMLInputElement>) {
		if (event.target.value.length !== 0) {
			res = tab.filter(str => str.includes(event.target.value)).map(
				filtered =>
				<ListItem>
					{filtered}
				</ListItem>
			)
		}
		setInput(prevInput => res)
	}

 	return (
		<>
			<div style={{
				"fontSize": "10rem"
			}}>
				<TextField onChange={updateInput} sx={{
					"width": "40%",
					"height": "50%",
					"margin": "auto"
				}}/>
				<List>
					{input}
				</List>
			</div>
		</>
  )
}

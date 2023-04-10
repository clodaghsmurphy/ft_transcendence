import React, { useState } from 'react'
import './CreateGame.css'

const CREATE = 1;
const BROWSE = 2;

export default function CreateGame() {
	let [window, setWindow] = useState(CREATE)

	function changeWindow(win: number) {
		if (window != win) {
			if (win === CREATE) {
				setWindow(CREATE)
			} else if (win === BROWSE) {
				setWindow(BROWSE)
			}
		}
	}

	return (
		<div className='create-game'>
			<div className='buttonHolder'>
				<button 
					onClick={() => changeWindow(CREATE)}>
					Create
				</button>
				<button 
					onClick={() => changeWindow(BROWSE)}>
					Browse
				</button>
			</div>
			<h1>Create a game</h1>
		</div>
	)
}

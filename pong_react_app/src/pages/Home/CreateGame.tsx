import React, { useState } from 'react'
import './CreateGame.css'
import GameSettings from './GameSettings';

const CREATE = 1;
const BROWSE = 2;

export default function CreateGame() {
	let [window, setWindow] = useState(CREATE)
	const is_create = window === CREATE

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
			<div className={is_create ?
						'button-holder-create' :
						'button-holder-browse'}>
				<button className='button-create'
					onClick={() => changeWindow(CREATE)}>
					Create
				</button>
				<button className='button-browse'
					onClick={() => changeWindow(BROWSE)}>
					Browse
				</button>
			</div>
			<h1>{is_create ? 'Create a game' :
				'Browse games'}</h1>

			{is_create ? <GameSettings /> : <div/> /*<GameBrowsing /> */}
		</div>
	)
}

import React, { useState } from 'react'
import './CreateGame.css'
import GameSettings from './GameSettings';
import { GamePost } from '../Game/Game';

const CREATE = 1;
const BROWSE = 2;

export default function CreateGame(settings: GamePost, default_settings: GamePost,
	setSettings: React.Dispatch<React.SetStateAction<GamePost>>,
	set_game_id: React.Dispatch<React.SetStateAction<number | null>>) {
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

			{is_create ?
				GameSettings(settings, default_settings, setSettings, set_game_id) :
				<div/> /*<GameBrowsing /> */}
		</div>
	)
}

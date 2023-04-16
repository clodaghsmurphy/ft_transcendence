import React, { useEffect, useState } from 'react'
import './CreateGame.css'
import GameSettings from './GameSettings';
import { GameMap, GamePost } from '../Game/Game';
import BrowseGames from './BrowseGames';
import { socket_game } from '../Game/Game';
import { GameStart } from './Dashboard';
import { GameInfo, GameFinished } from './CrossingFeilds'

const CREATE = 1;
const BROWSE = 2;
const INGAME = 3;
const FINISH = 4;

export default function CreateGame(settings: GamePost, default_settings: GamePost,
	setSettings: React.Dispatch<React.SetStateAction<GamePost>>,
	set_game_id: React.Dispatch<React.SetStateAction<number | null>>,
	game_id: number | null) {
	let [window_type, setWindow] = useState(CREATE)
	const [leave_function, set_leave_function] = useState<(() => void) | null>(null)
	const is_create = window_type === CREATE
	const SettingsBlock = GameSettings(settings, default_settings, setSettings, set_game_id)
	const BrowsingBlock = BrowseGames()
	const Game_Info = GameInfo(settings)
	const Game_Finished = GameFinished(leave_function)

	useEffect(() => {
		if (socket_game) {

			socket_game.on('gamestart', (data: GameStart) => {
				setWindow(INGAME)
				setSettings({
					user_id: 0,
					racket_length: data.state.racket_length,
					racket_speed: data.state.racket_speed,
					ball_initial_radius: data.state.ball_initial_radius,
					ball_initial_speed: data.state.ball_initial_speed,
					winning_goals: data.state.winning_goals,
					mode_speedup: data.state.mode_speedup,
					mode_shrink: data.state.mode_shrink,
					mode_chaos: data.state.mode_chaos,
					game_map: GameMap.Classic, // A CHANGER !!!
				})
			})

			socket_game.on('gameover', () => {
				setWindow(FINISH)
			})
		}
	}, [socket_game])

	useEffect(() => {
		if (socket_game && game_id) {
			const handleLeave = () => {
				socket_game.emit('leave', { game_id })
			}
			set_leave_function(() => {return handleLeave}) // xd
		}
	}, [socket_game, game_id])

	function changeWindow(win: number) {
		if (window_type != win) {
			if (win === CREATE) {
				setWindow(CREATE)
			} else if (win === BROWSE) {
				setWindow(BROWSE)
			}
		}
	}

	if (window_type === INGAME) {
		return (
			<div className='create-game'>
				{Game_Info}
			</div>
		)
	} else if (window_type === FINISH) {
		return (
			<div className='create-game'>
				{Game_Finished}
			</div>
		)
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

			{is_create ? SettingsBlock : BrowsingBlock}
		</div>
	)
}

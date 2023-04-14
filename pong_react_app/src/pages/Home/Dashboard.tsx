import React, { useEffect, useState } from 'react'
import NavBar from '../Components/NavBar'
import nathan from '../../media/nguiard.jpg';
import './Dashboard.css'
import { useContext } from 'react';
import { AuthContext } from '../../App';
import CreateGame from './CreateGame';
import { io, Socket } from 'socket.io-client';
import axios, { AxiosResponse, AxiosStatic } from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import '../Chat/ToastifyFix.css'
import Game, { GameMap, GamePost } from '../Game/Game';

const params = new URLSearchParams(window.location.search)

export type GameType = {
	id: number,
	ongoing: boolean,
	player1: number,
	player1_goals: number | null,
	player2: number,
	player2_goals: number | null,
	winner: number | null
}

function Dashboard()
{
	const {state, dispatch} = useContext(AuthContext);
	const default_settings: GamePost = {
		user_id: Number(state.user.id),
		target_id: 4,
		racket_length: 80,
		racket_speed: 10,
		ball_initial_radius: 20,
		ball_initial_speed: 10,
		winning_goals: 5,
		mode_speedup: false,
		mode_shrink: false,
		mode_chaos: false,
		game_map: GameMap.MazeMadness,
	}
	let [game_id, set_game_id] = useState(params.get("id") ? null :
											Number(params.get("id")))
	let [settings, setSettings] = useState(default_settings)
	let [is_create, set_is_create] = useState(false)

	useEffect(() => {
		document.title = 'Home'

		if (game_id) {
			axios.get('/api/game/' + game_id)
				.then((response: AxiosResponse) => {
					toast.success('Game created')
				})
		}

	}, [])

	console.log('inside dasboard:', game_id)

	return (
		<div className="dashboard">
			<div className='body '>
			<div className="app">
			<NavBar />
			<ToastContainer theme='dark'/>
		<main className="page-wrapper">
				<div className="game">
					{Game(game_id)}
					<div className="player-vs">
						<div className="player">
							<div className="avatar">
								<img src={state.user.avatar} />
							</div>
							<div className="player-info">
								<span className="player-name">{state.user.name}</span>
								<span className="player-level">LVL 12</span>
							</div>
						</div>
						<div className="score">0 - 0</div>
						<div className="player">
							<div className="avatar">
								<img src={nathan} />
							</div>
							<div className="player-info">
								<span className="player-name">nguiard</span>
								<span className="player-level">LVL 12</span>
							</div>
						</div>
					</div>
				</div>
				{CreateGame(settings, default_settings, setSettings, set_game_id)}
			</main>
			</div>
		</div>
		</div>
    );
}

export default Dashboard;

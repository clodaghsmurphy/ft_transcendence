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
import Scores from './Scores';
import { ActionKind } from "../../store/reducer"

const params = new URLSearchParams(window.location.search)

export type GameType = {
	id: number,
	ongoing: boolean,
	player1: number,
	player1_goals: number | null,
	player1_rating_change: number | null,
	player2: number,
	player2_goals: number | null,
	player2_rating_change: number | null,
	winner: number | null
}

function Dashboard()
{
	const {state, dispatch} = useContext(AuthContext);
	const default_settings: GamePost = {
		user_id: Number(state.user.id),
		// target_id: 4,
		racket_length: 80,
		racket_speed: 10,
		ball_initial_radius: 20,
		ball_initial_speed: 15,
		winning_goals: 5,
		mode_speedup: false,
		mode_shrink: false,
		mode_chaos: false,
		game_map: GameMap.Classic,
	}
	let [game_id, set_game_id] = useState(params.get("id") ?
											Number(params.get("id")) :
											null)
	let [settings, setSettings] = useState(default_settings)
	let [is_create, set_is_create] = useState(false)
	let [game_data, set_game_data] = useState(null as GameType | null)

	useEffect(() => {
		document.title = 'Home'

		axios.get('/api/user/info/' + state.user.id)
			.then(() => {})
			.catch(() => {
				axios.post(`http://${window.location.hostname}:8080/api/auth/logout`)
					.then(() => {})
					.catch(() => {})
				dispatch ({
					type: ActionKind.Logout
				});
				localStorage.clear();
			})

		if (game_id) {
		}

		if (!game_id) {
		}

	}, [])

	useEffect(() => {
		if (game_id) {
			axios.get('/api/game/' + game_id)
				.then((response: AxiosResponse) => {
					set_game_data(response.data)
				})
		}
	}, [game_id])

	return (
		<div className="dashboard">
			<div className='body '>
			<div className="app">
			<NavBar />
			<ToastContainer theme='dark'/>
		<main className="page-wrapper">
				<div className="game">
					{Game(game_id)}
					{Scores(game_data)}
				</div>
				{CreateGame(settings, default_settings, setSettings, set_game_id)}
			</main>
			</div>
		</div>
		</div>
    );
}

export default Dashboard;

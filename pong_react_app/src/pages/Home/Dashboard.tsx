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
import Game, { GameMap, GamePost, socket_game } from '../Game/Game';
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

export type GameStart = {
	has_starte: boolean,
	id: number,
	player1_id: number,
	player1_ready: boolean,
	player2_id: number,
	player2_ready: boolean,
	state: {
		ball_dir_x: number,
		ball_dir_y: number,
		ball_pos_x: number,
		ball_pos_y: number,
		ball_initial_radius: number,
		ball_initial_speed: number,
		ball_radius: number,
		ball_speed: number,
		current_pause: number,
		height: number,
		mode_chaos: boolean,
		mode_shrink: boolean,
		mode_speedup: boolean,
		obstacles: [],
		ongoing: boolean,
		player1_dir: number,
		player2_dir: number,
		player1_goals: number,
		player2_goals: number,
		player1_pos: number,
		player2_pos: number,
		racket_length: number,
		racket_shift: number,
		racket_speed: number,
		racket_width: number,
		width: number,
		winning_goals: number,
	}
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
		if (socket_game) {
			socket_game.removeListener('gamestart')

			const handleStart = (data: GameStart) => {
				set_game_data({
					id: data.id,
					ongoing: data.state.ongoing,
					player1: data.player1_id,
					player1_goals: data.state.player1_goals,
					player1_rating_change: null,
					player2: data.player2_id,
					player2_goals: data.state.player2_goals,
					player2_rating_change: null,
					winner: null
				})
			}

			socket_game.on('gamestart', handleStart)
		}
	}, [socket_game])

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
				{CreateGame(settings, default_settings, setSettings, set_game_id, game_id)}
			</main>
			</div>
		</div>
		</div>
    );
}

export default Dashboard;

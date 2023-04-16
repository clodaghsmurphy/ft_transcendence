import React, { useEffect, useState, useRef, useContext} from 'react'
import { Link } from 'react-router-dom'
import User, { id_to_user } from '../utils/User'
import NavBar from '../Components/NavBar'
import '../Home/Dashboard.css'
import { ReactP5Wrapper } from 'react-p5-wrapper'
import sketch from './sketches/sketch'
import waiting_sketch from './sketches/waiting'
import { io, Socket } from 'socket.io-client';
import './Game.css'
import { AuthContext } from '../../App'
import axios, { AxiosResponse, AxiosError } from 'axios'

const { v4: uuidv4 } = require('uuid');

export enum GameMap {
	Classic = "classic",
	Pendulum = "pendulum",
	DoubleTrouble = "double trouble",
	ParallelPeril = "parallel peril",
	MazeMadness = "maze madness",
};

export type GamePost = {
	user_id: number,
	target_id?: number,
	racket_length: number,
	racket_speed: number,
	ball_initial_radius: number,
	ball_initial_speed: number,
	winning_goals: number,
	mode_speedup: boolean,
	mode_shrink: boolean,
	mode_chaos: boolean,
	game_map: GameMap,
}

export let socket_game = io(`http://${window.location.hostname}:8080/game`,
{
	extraHeaders: {
		Authorization: "Bearer " + localStorage.getItem('token')
	}
})

socket_game.on('exception', (data: any) => {
	console.log('EXCEPTION !!!\n', data)
})

socket_game.on('disconnect', () => {
	console.log('DISCONNECTED!!!!!!!!!')
})

socket_game.on('start', (a: any) => console.log(a))

function Game(game_id: number | null) {

	const [isJoined, setIsJoined] = useState(false);
	const { state, dispatch } = useContext(AuthContext);
	const [data, setData] = useState(null);
	const [is_finished, set_finished] = useState(false)
	const [end_frame, set_end_frame] = useState(<div />)

	useEffect(() => {
		if (game_id) {

			const join_dto = {
				user_id: state.user.id,
				// target_id: 4,
				id: game_id,
			};

			console.log(join_dto)

			socket_game.emit('join', join_dto);
		}
	}, [game_id])

	socket_game.on('update', (dto) => {
		setData(dto);
	});

	socket_game.on('join', (res) => {
		console.log(`join: ${res.id}`);
		setIsJoined(true);
		set_finished(false)
	});

	useEffect(() => {
		if (socket_game) {
			socket_game.removeListener('gameover')

			let handleGameover = (data: any) => {
				set_finished(true)
	
				// a changer par data de gameover
				data = {
					winner: 11,
					player1: 11,
					player2: 3,
					player1_goals: 5,
					player2_goals: 5,
				}
				axios.get('/api/user/info/' + data.player1)
					.then((response: AxiosResponse) => {
						let p1 = response.data
	
						axios.get('/api/user/info/' + data.player2)
							.then((response: AxiosResponse) => {
								let p2 = response.data
								let winner = p2.id === data.winner ? p2 : p1
								let loser = winner === p2 ? p1 : p2
	
								set_end_frame(<div className='end-frame'>
									<h1 className='game-over'>Game over</h1>
									<div className='winner'>{winner.name} has won!</div>
									<div>{p1.name} {data.player1_goals} - {data.player2_goals} {p2.name}</div>
								</div>)
							})
					})	
			}

			socket_game.on('gameover', handleGameover)
		}
	}, [socket_game, set_finished, set_end_frame])

	useEffect(() => {
		let isKeyPressed = false;
		const handleKeyEvent = (event: KeyboardEvent, action: string) => {
			let keyEvent = {
				action: action,
				key: ""
			};

			if (event.key === "ArrowUp" || event.key === "w") {
				keyEvent.key = "Up";
			} else if (event.key === "ArrowDown" || event.key === "s") {
				keyEvent.key = "Down";
			} else {
				return ;
			}

			let key_data = {
				"id": game_id,
				"user_id": Number(state.user.id),
				"keyEvent": keyEvent,
			}

			if (game_id && !is_finished)
				socket_game.emit("keyEvent", key_data);
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (isKeyPressed)
			return ;
			isKeyPressed = true;
			handleKeyEvent(event, "Press");
		}

		const handleKeyUp = (event: KeyboardEvent) => {
			isKeyPressed = false;
			handleKeyEvent(event, "Release");
		}

		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("keyup", handleKeyUp);

		return () => {

			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("keyup", handleKeyUp);
		};
	}, [game_id, is_finished]);

	if (!isJoined) {
		return (
			<div className="dashboard"
					style={{
						backgroundColor: 'darkblue'
					}}>
				<div id="game" style={{
					position: 'relative',
					overflow: 'hidden',
				}}>
					<ReactP5Wrapper sketch={waiting_sketch} ></ReactP5Wrapper>
				</div>
			</div>
		);
	} else if (!is_finished) {
		return (
			<div className="dashboard"
					style={{
						backgroundColor: 'darkblue'
					}}>
				<div id="game" style={{
					position: 'relative',
					overflow: 'hidden',
				}}>
					<ReactP5Wrapper sketch={sketch} data={data}></ReactP5Wrapper>
				</div>
			</div>
		);
	} else {
		return (
			<div className="dashboard"
					style={{
						backgroundColor: 'black'
					}}>
				{end_frame}
			</div>
		);
	}
}

export default Game;

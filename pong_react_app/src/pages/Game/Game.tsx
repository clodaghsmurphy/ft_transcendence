import React, { useEffect, useState, useRef, useContext} from 'react'
import { Link } from 'react-router-dom'
import User, { id_to_user } from '../utils/User'
import NavBar from '../Components/NavBar'
import '../Home/Dashboard.css'
import { ReactP5Wrapper } from 'react-p5-wrapper'
import sketch from './sketches/sketch'
import { io, Socket } from 'socket.io-client';
import './Game.css'
import { AuthContext } from '../../App'
import axios, { AxiosResponse, AxiosError } from 'axios'

const BALL_SIZE = 10;
const BALL_SPEED = 10;
const PADDLE_HEIGHT = 80;
const PADDLE_SPEED = 20;

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
	target_id: number,
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

let socket_game = io(`http://${window.location.hostname}:8080/game`,
{
	extraHeaders: {
		Authorization: "Bearer " + localStorage.getItem('token')
	}
})

socket_game.on('connect', () => {
	console.log('CONNECTED')
})

socket_game.on('exception', (data: any) => {
	console.log('EXCEPTION !!!\n', data)
})

socket_game.on('disconnect', () => {
	console.log('DISCONNECTED!!!!!!!!!')
})

function Game(game_id: number | null) {

	const [isJoined, setIsJoined] = useState(false);
	const { state, dispatch } = useContext(AuthContext);
	const [data, setData] = useState(null);

	const connect = () => {
		socket_game.on("connect", () => {
			console.log("Connected to game");
			console.log(socket_game);
		});
	}
	
	useEffect(() => {
		if (game_id) {
			
			const join_dto = {
				user_id: state.user.id,
				target_id: 4,
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
	});

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

			const key_data = {
				"id": game_id,
				"user_id": Number(state.user.id),
				"keyEvent": keyEvent,
			}
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
	}, []);

	console.log(isJoined)

	if (!isJoined) {
		return (
			<div className="dashboard">
				<div>
					<div style={{fontSize: '13rem'}}>Waiting...</div>
				</div>
			</div>
		);
	} else {
		return (
			<div className="dashboard">
				<div id="game" style={{position: 'relative', overflow: 'hidden'}}>
					<ReactP5Wrapper sketch={sketch} data={data}></ReactP5Wrapper>
				</div>
			</div>
		);
	}
}

export default Game;

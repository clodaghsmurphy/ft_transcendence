import React, { useEffect, useState, useRef, useContext} from 'react'
import { Link } from 'react-router-dom'
import User, { id_to_user } from '../utils/User'
import NavBar from '../Components/NavBar'
import { io, Socket } from 'socket.io-client';
import './Game.css'
import { AuthContext } from '../../App'
import axios, { AxiosResponse, AxiosError } from 'axios'

const BALL_SIZE = 10;
const BALL_SPEED = 10;
const PADDLE_HEIGHT = 80;
const PADDLE_SPEED = 20;

const { v4: uuidv4 } = require('uuid');

type GamePost = {
	id_user: number,
}

export let socket_game: Socket

function Game() {
	
	const [isJoined, setIsJoined] = useState(false);
	const { state, dispatch } = useContext(AuthContext);

	const connect = () => {
		socket_game = io(`http://${window.location.hostname}:8080/game`,
		{
			extraHeaders: {
				Authorization: "Bearer " + localStorage.getItem('token')
			}
		});
		socket_game.on("connect", () => {
			console.log("Connected to game");
			// socket_game.emit("custom_event", {name: "Bob", age:12})
			console.log(socket_game);
		});
		let body: GamePost = {
			id_user: Number(state.user.id),
		}
		axios.post('/api/game/create', body)
			.then((response: AxiosResponse) => {
				socket_game.emit('create', {
					id_user: Number(state.user.id),
				})
			})
	}
	
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "ArrowUp") {
				socket_game.emit('toucheAppuyee', { touche: 'ArrowUp' });
				console.log("emit ArrowUp");
			} else if (event.key === "ArrowDown") {
				socket_game.emit('toucheAppuyee', { touche: 'ArrowDown' });
				console.log("emit ArrowDown");
			} else if (event.key === "w") {	
				socket_game.emit('toucheAppuyee', { touche: 'w' });
				console.log("emit w");
			} else if (event.key === "s") {
				socket_game.emit('toucheAppuyee', { touche: 's' });
				console.log("emit s");
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);
	
	const handleJoinGame = async () => {
		// Appel à la fonction pour rejoindre la partie
		try {
			await connect();
			setIsJoined(true);
		} catch (error) {
			console.log(error);
		}
	};
	
	if (!isJoined) {
		return (
			<div>
				<button onClick={handleJoinGame}>Rejoindre la partie</button>
			</div>
		);
	} else {
		return (
			<div id="game">
				<div id="leftPaddle"></div>
				<div id="ball"></div>
				<div id="score">0-0</div>
				<div id="rightPaddle"></div>
			</div>
		);
	}
}

export default Game;

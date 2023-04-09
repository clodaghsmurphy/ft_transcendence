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
	target_id: number,
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
			target_id: 4,
		}
		axios.post('/api/game/create', body)
			.then((response: AxiosResponse) => {
				console.log('Received message :', body);
				// socket_game.emit('create', { body: body })
				// socket_game.on('create', (data:any) => {
				// });
			})
	}

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

			// let data = {
			// 	"user_id": Number(state.user.id),
			// 	"keyEvent": keyEvent,
			// 	// "id": 1,
				
			// }
			// This wont work yet
			// The object transmitted to keyEvent should be of form:
			// "id": id_of_game
			// "user_id": id_of the user
			// "keyEvent": keyEvent object
			let data = {
				"id": 1,
				"user_id": Number(state.user.id),
				"keyEvent": keyEvent,
			}
			socket_game.emit("keyEvent", data);
			console.log(`emit keyEvent: ${JSON.stringify(data)}`);
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

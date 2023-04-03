import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import User from './User'
import NavBar from './NavBar'
import { io, Socket } from 'socket.io-client';
import './Game.css'

const BALL_SIZE = 10;
const BALL_SPEED = 10;
const PADDLE_HEIGHT = 80;
const PADDLE_SPEED = 20;

const { v4: uuidv4 } = require('uuid');

// const socket: Socket = io(`http://${window.location.hostname}:8080/game`);

// socket.on("connect", () => {
//   console.log("CONNECTED to Game", socket.connected);
// });

// console.log(socket);

// socket.on("connect_error", (err:any) => {
// 	console.log(`connect_error due to ${err.message}`);
// });

function Game() {
	
	// useEffect(() => {
	// 	const handleKeyDown = (event: KeyboardEvent) => {
	// 		if (event.key === "ArrowUp") {
	// 			socket.emit('toucheAppuyee', { touche: 'ArrowUp' });
	// 			console.log("emit ArrowUp");
	// 		} else if (event.key === "ArrowDown") {
	// 			socket.emit('toucheAppuyee', { touche: 'ArrowDown' });
	// 			console.log("emit ArrowDown");
	// 		} else if (event.key === "w") {	
	// 			socket.emit('toucheAppuyee', { touche: 'w' });
	// 			console.log("emit w");
	// 		} else if (event.key === "s") {
	// 			socket.emit('toucheAppuyee', { touche: 's' });
	// 			console.log("emit s");
	// 		}
	// 	};
	// 	document.addEventListener("keydown", handleKeyDown);
	// 	return () => {
	// 		document.removeEventListener("keydown", handleKeyDown);
	// 	};
	// }, []);

	const connect = () => {
		const socket = io(`http://${window.location.hostname}:8080/game`);
		socket.on("connect", () => {
			console.log("Connected to game");
			socket.emit("custom_event", {name: "Bob", age:12})
			console.log(socket);
		});
	}

	useEffect(() => {
		connect();
	}, []);

	
	  

	return (
		<div id="game">
			<div id="leftPaddle"></div>
			<div id="ball"></div>
			<div id="score">0-0</div>
			<div id="rightPaddle"></div>
		</div>
	);
}

export default Game;

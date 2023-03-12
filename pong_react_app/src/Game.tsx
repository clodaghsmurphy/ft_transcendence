import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import User from './User'
import NavBar from './NavBar'
import './Game.css'

const BALL_SIZE = 10;
const BALL_SPEED = 1;
const PADDLE_HEIGHT = 80;

export default function Game() {
	const ballRef = useRef<HTMLDivElement>(null);
	const ballPosition = useRef({ x: window.innerWidth / 2 - BALL_SIZE / 2, y: window.innerHeight / 2 - BALL_SIZE / 2 });
	const ballSpeedX = useRef(BALL_SPEED);
	const ballSpeedY = useRef(BALL_SPEED);

	const [leftPaddleY, setLeftPaddleY] = useState<number>(window.innerHeight / 2 - PADDLE_HEIGHT / 2);
	const [rightPaddleY, setRightPaddleY] = useState<number>(window.innerHeight / 2 - PADDLE_HEIGHT / 2);
	const leftPaddleRef = useRef<HTMLDivElement>(null);
	const rightPaddleRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "ArrowUp") {
				setRightPaddleY(prevY => Math.max(PADDLE_HEIGHT / 2 + 10, prevY - 10));
			} else if (event.key === "ArrowDown") {
				setRightPaddleY(prevY => Math.min(window.innerHeight - PADDLE_HEIGHT / 2 - 10, prevY + 10));
			} else if (event.key === "z") {
				setLeftPaddleY(prevY => Math.max(PADDLE_HEIGHT / 2 + 10, prevY - 10));
			} else if (event.key === "s") {
				setLeftPaddleY(prevY => Math.min(window.innerHeight - PADDLE_HEIGHT / 2 - 10, prevY + 10));
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

  	useEffect(() => {
		const updateBall = () => {

			ballPosition.current = { x: ballPosition.current.x + ballSpeedX.current, y: ballPosition.current.y + ballSpeedY.current };

			if (ballPosition.current.x < 0 || ballPosition.current.x + BALL_SIZE > window.innerWidth) {
				ballSpeedX.current = -ballSpeedX.current;

			}
			if (ballPosition.current.y < 0 || ballPosition.current.y + BALL_SIZE > window.innerHeight) {
				ballSpeedY.current = -ballSpeedY.current;
			}
			if (ballRef.current) {
				ballRef.current.style.left = `${ballPosition.current.x}px`;
				ballRef.current.style.top = `${ballPosition.current.y}px`;
			}
		
			requestAnimationFrame(updateBall);
		};

		requestAnimationFrame(updateBall);
	}, []);

	useEffect(() => {
		if (leftPaddleRef.current && rightPaddleRef.current) {
		leftPaddleRef.current.style.top = `${leftPaddleY}px`;
		rightPaddleRef.current.style.top = `${rightPaddleY}px`;
		}
		console.log(ballPosition.current.x, ballPosition.current.y, ballSpeedX, ballSpeedY)

	}, []);


	return (
		<div id="game">
		<div id="leftPaddle" ref={leftPaddleRef}></div>
		<div id="ball" ref={ballRef}></div>
		<div id="score">0-0</div>
		<div id="rightPaddle" ref={rightPaddleRef}></div>
		</div>
	);
}
  
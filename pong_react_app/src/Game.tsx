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
	const ballSpeedY = useRef(Math.random() * (BALL_SPEED / 2 - -BALL_SPEED / 2) + -BALL_SPEED / 2);
	const ballSpeedX = useRef(Math.abs(BALL_SPEED - ballSpeedY.current));

	const [leftPaddleY, setLeftPaddleY] = useState<number>(window.innerHeight / 2);
	const [rightPaddleY, setRightPaddleY] = useState<number>(window.innerHeight / 2);
	const leftPaddleRef = useRef<HTMLDivElement>(null);
	const rightPaddleRef = useRef<HTMLDivElement>(null);

	// Movement paddle with keyboard
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


	

	// Movement ball
  	useEffect(() => {
		const updateBall = () => {

			if (ballRef.current) {
				ballRef.current.style.left = `${ballPosition.current.x}px`;
				ballRef.current.style.top = `${ballPosition.current.y}px`;
			}
			ballPosition.current = { x: ballPosition.current.x + ballSpeedX.current, y: ballPosition.current.y + ballSpeedY.current };


			// Left win
			if (ballPosition.current.x - BALL_SIZE / 2 < 0) {
				ballPosition.current = { x: window.innerWidth / 2 - BALL_SIZE / 2, y: window.innerHeight / 2 - BALL_SIZE / 2 };
				ballSpeedY.current = Math.random() * (BALL_SPEED / 2 - -BALL_SPEED / 2) + -BALL_SPEED / 2;
				ballSpeedX.current = -Math.abs(BALL_SPEED - ballSpeedY.current);
			}
			// Right win
			else if (ballPosition.current.x + BALL_SIZE / 2 > window.innerWidth) {
				ballPosition.current = { x: window.innerWidth / 2 - BALL_SIZE / 2, y: window.innerHeight / 2 - BALL_SIZE / 2 };
				ballSpeedY.current = Math.random() * (BALL_SPEED / 2 - -BALL_SPEED / 2) + -BALL_SPEED / 2;
				ballSpeedX.current = Math.abs(BALL_SPEED - ballSpeedY.current);
			}

			if (ballPosition.current.y - BALL_SIZE / 2 < 0 || ballPosition.current.y + BALL_SIZE / 2 > window.innerHeight) {
				ballSpeedY.current = -ballSpeedY.current;
			}
			requestAnimationFrame(updateBall);

		
		};

		requestAnimationFrame(updateBall);
	}, []);

	// Collision ball
	useEffect(() => {
		const checkBallCollision = () => {
		  const ballTop = ballPosition.current.y - BALL_SIZE / 2;
		  const ballBottom = ballPosition.current.y + BALL_SIZE / 2;
		  const ballLeft = ballPosition.current.x - BALL_SIZE / 2;
		  const ballRight = ballPosition.current.x + BALL_SIZE / 2;
	  
		  const leftPaddleTop = leftPaddleY - PADDLE_HEIGHT / 2;
		  const leftPaddleBottom = leftPaddleY + PADDLE_HEIGHT / 2;
		  const leftPaddleRight = window.innerWidth * 0.02 + 10;
		  const leftPaddleHit = ballLeft <= leftPaddleRight && ballTop <= leftPaddleBottom && ballBottom >= leftPaddleTop;
	  
		  const rightPaddleTop = rightPaddleY - PADDLE_HEIGHT / 2;
		  const rightPaddleBottom = rightPaddleY + PADDLE_HEIGHT / 2;
		  const rightPaddleLeft = window.innerWidth * 0.98 - 10;
		  const rightPaddleHit = ballRight >= rightPaddleLeft && ballTop <= rightPaddleBottom && ballBottom >= rightPaddleTop;
	  
		  if (leftPaddleHit || rightPaddleHit) {
			ballSpeedX.current = -ballSpeedX.current;
		  }
		  
		  requestAnimationFrame(checkBallCollision);
		};
	  
		requestAnimationFrame(checkBallCollision);
	  }, [leftPaddleY, rightPaddleY]);
	  

	// Movement paddle on screen
	useEffect(() => {
		if (leftPaddleRef.current && rightPaddleRef.current) {
		leftPaddleRef.current.style.top = `${leftPaddleY}px`;
		rightPaddleRef.current.style.top = `${rightPaddleY}px`;
		}
	}, [leftPaddleY, rightPaddleY]);


	return (
		<div id="game">
		<div id="leftPaddle" ref={leftPaddleRef}></div>
		<div id="ball" ref={ballRef}></div>
		<div id="score">0-0</div>
		<div id="rightPaddle" ref={rightPaddleRef}></div>
		</div>
	);
}
  
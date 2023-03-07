import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import User from './User'
import NavBar from './NavBar'
import './Game.css'

export default function Game() {
	const leftPaddleRef = useRef<HTMLDivElement>(null);
	const rightPaddleRef = useRef<HTMLDivElement>(null);
	const [leftPaddleY, setLeftPaddleY] = useState(0);
	const [rightPaddleY, setRightPaddleY] = useState(0);
  
	useEffect(() => {
	  const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === "ArrowUp") {
		  setRightPaddleY(prevY => prevY - 10);
		} else if (event.key === "ArrowDown") {
		  setRightPaddleY(prevY => prevY + 10);
		} else if (event.key === "z") {
		  setLeftPaddleY(prevY => prevY - 10);
		} else if (event.key === "s") {
		  setLeftPaddleY(prevY => prevY + 10);
		}
	  };
  
	  document.addEventListener("keydown", handleKeyDown);
  
	  return () => {
		document.removeEventListener("keydown", handleKeyDown);
	  };
	}, []);
  
	useEffect(() => {
	  if (leftPaddleRef.current && rightPaddleRef.current) {
		leftPaddleRef.current.style.top = `${leftPaddleY}px`;
		rightPaddleRef.current.style.top = `${rightPaddleY}px`;
	  }
	}, [leftPaddleY, rightPaddleY]);
  
	return (
	  <div id="game">
		<div id="leftPaddle" ref={leftPaddleRef}></div>
		<div id="ball"></div>
		<div id="score">0-0</div>
		<div id="rightPaddle" ref={rightPaddleRef}></div>
	  </div>
	);
  }
  
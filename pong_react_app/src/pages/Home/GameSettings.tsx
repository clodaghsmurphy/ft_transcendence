import React, { useState, useRef } from 'react'
import './CreateGame.css'

export type CreateGameTemplate = {
	target_id: number;
	racket_length?: number;
	racket_speed?: number;
	ball_radius?: number;
	ball_speed?: number;
	winning_goals?: number;
	mode_speedup?: boolean;
	mode_shrink?: boolean;
	mode_chaos?: boolean;
}

export const MIN_RACKET_LENGTH = 30;
export const MAX_RACKET_LENGTH = 150;

export const MIN_RACKET_SPEED = 10;
export const MAX_RACKET_SPEED = 50;

export const MIN_BALL_RADIUS = 5;
export const MAX_BALL_RADIUS = 100;

export const MIN_BALL_SPEED = 10;
export const MAX_BALL_SPEED = 30;

export const MIN_WINNING_GOALS = 3;
export const MAX_WINNING_GOALS = 20;


export default function GameSettings() {
	const default_settings: CreateGameTemplate = {
		target_id: 4,
		racket_length: 80,
		racket_speed: 10,
		ball_radius: 20,
		ball_speed: 10,
		winning_goals: 5,
		mode_speedup: false,
		mode_shrink: false,
		mode_chaos: false,
	}
	let [settings, setSettings] = useState(default_settings)
	let racket_length_ref = useRef<HTMLInputElement | null>(null)
	let racket_speed_ref = useRef<HTMLInputElement | null>(null)
	let ball_radius_ref = useRef<HTMLInputElement | null>(null)
	let ball_speed_ref = useRef<HTMLInputElement | null>(null)
	let winning_goals_ref = useRef<HTMLInputElement | null>(null)
	let speed_mode_ref = useRef<HTMLInputElement | null>(null)
	let shrink_mode_ref = useRef<HTMLInputElement | null>(null)
	let chaos_mode_ref = useRef<HTMLInputElement | null>(null)

	return (
	<div className='game-settings'>
		<h2>Racket length: {settings.racket_length}</h2>
		<div className='range-settings'>
			{MIN_RACKET_LENGTH}
			<input type='range'
					className='range'
					min={MIN_RACKET_LENGTH}
					max={MAX_RACKET_LENGTH}
					ref={racket_length_ref}
					onChange={() => setSettings((prev) => ({
						...prev,
						racket_length: Number(racket_length_ref.current?.value)
					}))}
					value={settings.racket_length}/>
			{MAX_RACKET_LENGTH}
		</div>

		<h2>Racket speed: {settings.racket_speed}</h2>
		<div className='range-settings'>
			{MIN_RACKET_SPEED}
			<input type='range'
					className='range'
					min={MIN_RACKET_SPEED}
					max={MAX_RACKET_SPEED}
					ref={racket_speed_ref}
					onChange={() => setSettings((prev) => ({
						...prev,
						racket_speed: Number(racket_speed_ref.current?.value)
					}))}
					value={settings.racket_speed}/>
			{MAX_RACKET_SPEED}
		</div>

		<h2>Ball radius: {settings.ball_radius}</h2>
		<div className='range-settings'>
			{MIN_BALL_RADIUS}
			<input type='range'
					className='range'
					min={MIN_BALL_RADIUS}
					max={MAX_BALL_RADIUS}
					ref={ball_radius_ref}
					onChange={() => setSettings((prev) => ({
						...prev,
						ball_radius: Number(ball_radius_ref.current?.value)
					}))}
					value={settings.ball_radius}/>
			{MAX_BALL_RADIUS}
		</div>

		<h2>Ball speed: {settings.ball_speed}</h2>
		<div className='range-settings'>
			{MIN_BALL_SPEED}
			<input type='range'
					className='range'
					min={MIN_BALL_SPEED}
					max={MAX_BALL_SPEED}
					ref={ball_speed_ref}
					onChange={() => setSettings((prev) => ({
						...prev,
						ball_speed: Number(ball_speed_ref.current?.value)
					}))}
					value={settings.ball_speed}/>
			{MAX_BALL_SPEED}
		</div>

		<h2>Goals to win: {settings.winning_goals}</h2>
		<div className='range-settings'>
			{MIN_WINNING_GOALS}
			<input type='range'
					className='range'
					min={MIN_WINNING_GOALS}
					max={MAX_WINNING_GOALS}
					ref={winning_goals_ref}
					onChange={() => setSettings((prev) => ({
						...prev,
						winning_goals: Number(winning_goals_ref.current?.value)
					}))}
					value={settings.winning_goals}/>
			{MAX_WINNING_GOALS}
		</div>

		<div className='bar-create' />

		<div className='gamemode'>
			<h2>speedup mode:</h2>
			<input type='checkbox'
					ref={speed_mode_ref}
					value={String(settings.mode_speedup)}
					onClick={() => setSettings((prev) => ({
						...prev,
						mode_speedup: !settings.mode_speedup,
					}))}/>
		</div>

		<div className='gamemode'>
			<h2>shrink mode:</h2>
			<input type='checkbox'
					ref={shrink_mode_ref}
					value={String(settings.mode_shrink)}
					onClick={() => setSettings((prev) => ({
						...prev,
						mode_shrink: !settings.mode_shrink,
					}))}/>
		</div>

		<div className='gamemode'>
			<h2 style={{
				color: 'red'
			}}>chaos mode:</h2>
			<input type='checkbox'
					ref={chaos_mode_ref}
					value={String(settings.mode_chaos)}
					onClick={() => setSettings((prev) => ({
						...prev,
						mode_chaos: !settings.mode_chaos,
					}))}/>
		</div>

		<div className='bar-create' />

		<div className='buttons-create-and-reset'>
			<button onClick={() => setSettings(default_settings)}
				style={{
					backgroundColor: 'grey',
				}}>
				Reset to default
			</button>

			<button onClick={() => console.log(settings)}
				style={{
					backgroundColor: '#c0e085',
				}}>
				Create the game
			</button>
		</div>
	</div>
	)
}

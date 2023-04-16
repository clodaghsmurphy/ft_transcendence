import React, { useState, useRef, useContext } from 'react'
import './CreateGame.css'
import axios, { AxiosError, AxiosResponse } from 'axios';
import { GameMap, GamePost } from '../Game/Game';
import { AuthContext } from '../../App';
import { toast } from 'react-toastify'
import Classic from '../../media/Classic.png'
import MazeMadness from '../../media/MazeMadness.png'
import Pendulum from '../../media/Pendulum.png'
import DoubleTrouble from '../../media/DoubleTrouble.png'
import ParallelPeril from '../../media/ParallelPeril.png'

export const MIN_RACKET_LENGTH = 30;
export const MAX_RACKET_LENGTH = 150;

export const MIN_RACKET_SPEED = 10;
export const MAX_RACKET_SPEED = 50;

export const MIN_BALL_RADIUS = 5;
export const MAX_BALL_RADIUS = 50;

export const MIN_BALL_SPEED = 15;
export const MAX_BALL_SPEED = 30;

export const MIN_WINNING_GOALS = 3;
export const MAX_WINNING_GOALS = 20;


export default function GameSettings(settings: GamePost, default_settings: GamePost,
	setSettings: React.Dispatch<React.SetStateAction<GamePost>>,
	set_game_id: React.Dispatch<React.SetStateAction<number | null>>) {

	let racket_length_ref = useRef<HTMLInputElement | null>(null)
	let racket_speed_ref = useRef<HTMLInputElement | null>(null)
	let ball_initial_radius_ref = useRef<HTMLInputElement | null>(null)
	let ball_initial_speed_ref = useRef<HTMLInputElement | null>(null)
	let winning_goals_ref = useRef<HTMLInputElement | null>(null)
	let speed_mode_ref = useRef<HTMLInputElement | null>(null)
	let shrink_mode_ref = useRef<HTMLInputElement | null>(null)
	let chaos_mode_ref = useRef<HTMLInputElement | null>(null)
	let classic_ref = useRef<HTMLInputElement | null>(null)
	let double_trouble_ref = useRef<HTMLInputElement | null>(null)
	let pendulum_ref = useRef<HTMLInputElement | null>(null)
	let parallel_ref = useRef<HTMLInputElement | null>(null)
	let maze_ref = useRef<HTMLInputElement | null>(null)

	function post_game() {
		axios.post('/api/game/create', settings)
			.then((response: AxiosResponse) => {
				set_game_id(response.data.id)
			})
			.catch((e: AxiosError) => {
			})
	}

	return (
	<div className='game-settings'>
		<div className='container-settings'>
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

		<h2>Ball radius: {settings.ball_initial_radius}</h2>
		<div className='range-settings'>
			{MIN_BALL_RADIUS}
			<input type='range'
					className='range'
					min={MIN_BALL_RADIUS}
					max={MAX_BALL_RADIUS}
					ref={ball_initial_radius_ref}
					onChange={() => setSettings((prev) => ({
						...prev,
						ball_initial_radius: Number(ball_initial_radius_ref.current?.value)
					}))}
					value={settings.ball_initial_radius}/>
			{MAX_BALL_RADIUS}
		</div>

		<h2>Ball speed: {settings.ball_initial_speed}</h2>
		<div className='range-settings'>
			{MIN_BALL_SPEED}
			<input type='range'
					className='range'
					min={MIN_BALL_SPEED}
					max={MAX_BALL_SPEED}
					ref={ball_initial_speed_ref}
					onChange={() => setSettings((prev) => ({
						...prev,
						ball_initial_speed: Number(ball_initial_speed_ref.current?.value)
					}))}
					value={settings.ball_initial_speed}/>
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
					checked={settings.mode_speedup}
					onChange={() => setSettings((prev) => ({
						...prev,
						mode_speedup: !settings.mode_speedup,
					}))}/>
		</div>

		<div className='gamemode'>
			<h2>shrink mode:</h2>
			<input type='checkbox'
					ref={shrink_mode_ref}
					checked={settings.mode_shrink}
					onChange={() => setSettings((prev) => ({
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
					checked={settings.mode_chaos}
					onChange={() => setSettings((prev) => ({
						...prev,
						mode_chaos: !settings.mode_chaos,
					}))}/>
		</div>

		<div className='bar-create' />
		
		<div className='choose-map'>
			<img src={Classic} />
			<input type='checkbox'
					ref={classic_ref}
					checked={settings.game_map === GameMap.Classic}
					onChange={() => setSettings((prev) => ({
						...prev,
						game_map: GameMap.Classic,
					}))}/>
		</div>

		<div className='choose-map'>
			<img src={DoubleTrouble} />
			<input type='checkbox'
					ref={double_trouble_ref}
					checked={settings.game_map === GameMap.DoubleTrouble}
					onChange={() => setSettings((prev) => ({
						...prev,
						game_map: GameMap.DoubleTrouble,
					}))}/>
		</div>

		<div className='choose-map'>
			<img src={ParallelPeril} />
			<input type='checkbox'
					ref={parallel_ref}
					checked={settings.game_map === GameMap.ParallelPeril}
					onChange={() => setSettings((prev) => ({
						...prev,
						game_map: GameMap.ParallelPeril,
					}))}/>
		</div>

		<div className='choose-map'>
			<img src={Pendulum} />
			<input type='checkbox'
					ref={pendulum_ref}
					checked={settings.game_map === GameMap.Pendulum}
					onChange={() => setSettings((prev) => ({
						...prev,
						game_map: GameMap.Pendulum,
					}))}/>
		</div>

		<div className='choose-map'>
			<img src={MazeMadness} />
			<input type='checkbox'
					ref={maze_ref}
					checked={settings.game_map === GameMap.MazeMadness}
					onChange={() => setSettings((prev) => ({
						...prev,
						game_map: GameMap.MazeMadness,
					}))}/>
		</div>

		<div className='bar-create' />

		</div>

		<div className='buttons-create-and-reset'>
			<button onClick={() => setSettings(default_settings)}
				style={{
					backgroundColor: 'grey',
				}}>
				Reset to default
			</button>

			<button onClick={() => post_game()}
				style={{
					backgroundColor: '#c0e085',
				}}>
				Create the game
			</button>
		</div>
	</div>
	)
}

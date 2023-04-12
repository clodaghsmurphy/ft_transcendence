import React, { useState } from 'react'
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

export default function GameSettings() {
	let [settings, setSettings] = useState({target_id: 4} as CreateGameTemplate)

	return (
	<div className='game-settings'>
		<h2>Racket lenght:</h2>
		<input type='range' min={} max={} />
	</div>
	)
}

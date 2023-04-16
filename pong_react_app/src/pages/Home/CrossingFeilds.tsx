import React from "react";
import { GamePost } from "../Game/Game";
import './CreateGame.css'

export function GameInfo(settings: GamePost) {
	let infos: JSX.Element
	if (settings.mode_chaos) {
		infos = (
			<div className="infos">
				<div className="chaos-mode">chaos mode</div>
			</div>
		)
	} else {
		infos = (
			<div className="infos">
				<div className="division" >
					ball radius: {settings.ball_initial_radius} <br />
					ball speed: {settings.ball_initial_speed} <br />
					racket length: {settings.racket_length} <br />
					racket speed: {settings.racket_speed}
				</div>
				<div className="bar-vertical" />
				<div className="division">
					mode speedup: {settings.mode_speedup} <br />
					mode shrink: {settings.mode_shrink} <br />
					gaols to win: {settings.winning_goals} <br />
					map: {settings.game_map}
				</div>
			</div>
		)
	}

	return infos
}

export function GameFinished(fnc: (() => void) | null) {

	if (!fnc) {
		return <div />
	}
	return (
		<div>
			<button className="button-leave-game"
				onClick={() => {
					fnc()
					window.location.replace(`http://${window.location.host}/game`)
				}}>
				Leave game
			</button>
		</div>
	)
}
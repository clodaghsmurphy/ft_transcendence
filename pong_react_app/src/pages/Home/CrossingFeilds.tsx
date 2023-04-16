import React, { useContext, useEffect, useState } from "react";
import { GamePost } from "../Game/Game";
import './CreateGame.css'
import { AuthContext } from '../../App'
import { User, id_to_user } from "../utils/User";
import { Channel } from "../Chat/Channels";
import axios, { AxiosResponse } from 'axios'
import { DirectMessage } from "../Chat/DirectMessage";
import { channel } from "diagnostics_channel";
import { info } from "console";
import { Socket } from "socket.io-client";

export function GameInfo(settings: GamePost,
						fnc: (() => void) | null,
						game_id: number | null,
						socket_variable: Socket)
{
	const { state, dispatch } = useContext(AuthContext);
	let [user, setUser] = useState({} as User)
	let [dm, setDm] = useState([] as DirectMessage[])
	let [chans, setChans] = useState([] as string[])
	let [all_user, set_all_users] = useState([] as User[])

	useEffect(() => {
		axios.get('/api/user/info/' + state.user.id)
			.then((response: AxiosResponse) => {
				setUser(response.data)
				setChans(response.data.channels)
			})
		
		axios.get('/api/user/info/')
			.then((response: AxiosResponse) => {
				set_all_users(response.data)
			})
		
		axios.get('/api/dm')
			.then((response: AxiosResponse) => {
				setDm(response.data)
			})
				
	}, [])

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
				<div className="division">
					speedup: {String(settings.mode_speedup)} <br />
					shrink: {String(settings.mode_shrink)} <br />
					gaols to win: {settings.winning_goals} <br />
				</div>
			</div>
		)
	}

	if (!fnc || typeof user.channels === undefined || !game_id) {
		console.log(!fnc, typeof user.channels === undefined, !game_id)
		return <div>rien?</div>
	}
	return (
		<div className="cointainer-wait">
			<h1>Infos:</h1>
			{infos}
			<button className="button-leave-game"
				onClick={() => {
					fnc()
					window.location.replace(`http://${window.location.host}/game`)
				}}>
				Leave game
			</button>
			<h1>Invite:</h1>
			<div className="invite-container">
				<h2>Users:</h2>
				{dm.map((dm: DirectMessage) =>
					<div className="invite-button-game" key={dm.id}
						onClick={() => {
						socket_variable.emit('invite_dm', {
							target_id: dm.id,
							id: game_id
						})
					}}>
						{id_to_user(all_user, dm.id).name}
					</div>
				)}
				<h2>Channels:</h2>
				{chans.map((chan: string) =>
					<div className="invite-button-game" key={chan}
						onClick={() => {
						socket_variable.emit('invite_chan', {
							target_id: chan,
							game_id
						})
					}}>
						{chan}
					</div>
				)}
			</div>
		</div>
	)
}

export function GameFinished(fnc: (() => void) | null) {

	if (!fnc) {
		return <div>rien?</div>
	}
	return (
		<button className="button-leave-game"
			onClick={() => {
				fnc()
				window.location.replace(`http://${window.location.host}/game`)
			}}>
			Leave game
		</button>
	)
}
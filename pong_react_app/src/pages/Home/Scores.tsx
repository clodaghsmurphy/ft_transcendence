import React, { useEffect, useState } from 'react'
import ft from '../../media/42_Logo 3.png'
import { GameType } from './Dashboard'
import axios, { AxiosError, AxiosResponse } from 'axios'
import User from '../utils/User'
import { toast } from 'react-toastify'
import unknown_icon from '../../media/unkonwn.jpg'

import socket_game from '../Game/Game'

export default function Scores(data: GameType | null) {
	let [p1, set_p1] = useState({} as User)
	let [p2, set_p2] = useState({} as User)

	useEffect(() => {
		if (data) {
			axios.get('/api/user/info/' + data.player1)
				.then((response: AxiosResponse) => {
					set_p1(response.data)
				})
				.catch((err: AxiosError) => {
					toast.error((err.response!.data as any).error)
				})
			if (data.player2) {
				axios.get('/api/user/info/' + data.player2)
					.then((response: AxiosResponse) => {
						set_p2(response.data)
					})
					.catch((err: AxiosError) => {
						toast.error((err.response!.data as any).error)
					})
				}
			else {
				set_p2({
					name: 'unknown',
					avatar: unknown_icon
				} as User)
			}
		}
	}, [data?.player1, data?.player2])

	useEffect(() => {
		
	})

	if (!data) {
		return (<div className='player-vs' key='hip-hop-bank'>
			<div className='game-not-started-yet'>Waiting for a game to start...</div>
		</div>)
	}

	return (
		<div className="player-vs" key='hip-hop-bank'>
			<div className="player">
				<div className="avatar">
					<img src={p1.avatar} alt={p1.name}/>
				</div>
				<div className="player-info">
					<span className="player-name">{p1.name}</span>
					<span className="player-level">{0}</span>
				</div>
			</div>
			<div className="score">0 - 0</div>
			<div className="player">
				<div className="avatar">
					<img src={p2.avatar} alt={p2.name} />
				</div>
				<div className="player-info">
					<span className="player-name">{p2.name}</span>
					<span className="player-level">{0}</span>
				</div>
			</div>
		</div>
	)
}

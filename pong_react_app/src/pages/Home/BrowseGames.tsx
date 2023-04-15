import axios, { AxiosError, AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import './CreateGame.css'
import User from '../utils/User'
import { GameType } from './Dashboard'
import { Link } from 'react-router-dom'
import unknown_icon from '../../media/unkonwn.jpg'

export const WAITING = false
export const ONGOING = true

export default function BrowseGames() {
	let [GamesBlocks, setGamesBlocks] = useState([] as JSX.Element[])

	useEffect(() => {
		let tmp = [] as JSX.Element[]
		let data: GameType[] = []

		axios.get('/api/game/')
			.then((response: AxiosResponse) => {
				data = response.data as GameType[]

				for (const game of data) {
					let u1: User = {} as User
					let u2: User = {} as User
				
					axios.get('/api/user/info/' +  game.player1)
						.then((response: AxiosResponse) => {
							u1 = response.data
							axios.get('/api/user/info/' +  game.player2)
							.then((response: AxiosResponse) => {
								u2 = response.data
								tmp.push(browse_button(game, u1, u2))
							})
						})

				}
				setGamesBlocks(tmp)
			})
			.catch((err: AxiosError) => {
				toast.error('Could not fetch games')
			})
		
	}, [])

	return (
		<div>
			{GamesBlocks.length ? GamesBlocks : <div className='no-game-browse'>No games</div>}
		</div>
)
}

function browse_button(game: GameType, u1: User, u2?: User): JSX.Element {
	let status = ONGOING
	if (!u2) {
		u2 = {
			name: 'Unknown',
			avatar: unknown_icon,
		} as User
		status = WAITING
	}

	return (
		<div onClick={() => {window.location.replace(
					`http://${window.location.hostname}:8080/game?id=${game.id}`
				) }}
				className='browse-game-button'
				key={game.id}
				style={
					status == ONGOING ? {
					border: '#c0e085 2px solid'
				} : {
					border: '#e0be85 2px solid'
				}
				}
			>
			<div className='browse-user-1'>
				<div className='player-card-browse'>
					<img src={u1.avatar} alt={u1.name} />
					{u1.name}
				</div>
			</div>
			<div className='browse-status'>
				{status === ONGOING ? 'On-going' : 'Waiting'}
			</div>
			<div className='browse-user-2'>
			<div className='player-card-browse'>
					<img src={u2.avatar} alt={u2.name} />
					{u2.name}
				</div>
			</div>
		</div>
	)
}
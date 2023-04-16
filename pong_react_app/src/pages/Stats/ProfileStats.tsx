import React from "react";
import { useEffect, useState } from 'react'
import axios, { AxiosResponse } from 'axios'

type Stats = {
	wins : number,
  	total_games: number,
  	lvl: number,
	rating: number,
}

type Props = {
	id: string
}

const StatsDefault: Stats = {
	wins: 0,
	total_games: 0,
	lvl: 0,
	rating: 0
}

function ProfileStats(props: Props) {
	const [stats, setStats] = useState<Stats>(StatsDefault)
	const [ wins, setWins ] = useState(0);
	const [ loss, setLoss] = useState(0);


	const getStats = async () => {
		try {
			const result: AxiosResponse = await axios.post('/api/achievements/stats', {id: props.id})
			setStats(result.data);
			const zeroProtect: boolean = result.data.total_games === 0 && result.data.wins === 0;
			setWins(result.data.total_games === 0 ? 0 : Math.round((result.data.wins / result.data.total_games) * 100));
			setLoss(zeroProtect ? 0 : Math.round(((result.data.total_games - result.data.wins) / result.data.total_games) * 100));
		}
		catch(error) {}
	}

	useEffect(() => {
		getStats();
	}, [])

	return (
		<ul className="profile-game-stats">
			<li>
				<span  className="span-title">Total games</span>
				<span>{stats.total_games}</span>
			</li>
			<li>
				<span className="span-title">Wins</span>
				<span>{`${wins}%`}</span>
			</li>
			<li>
				<span className="span-title">Loss</span>
				<span>{`${loss}%`}</span>
			</li>
			<li>
				<span className="span-title" >Lvl</span>
				<span>{stats.lvl}</span>
			</li>
			<li>
				<span className="span-title">Rating</span>
				<span>{stats.rating}</span>
			</li>
		</ul>
	)
}

export default ProfileStats;

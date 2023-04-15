import React from "react";
import { useEffect, useState } from 'react'
import axios, { AxiosResponse, AxiosError} from 'axios'

type Stats = {
	wins : number,
  	total_games: number,
  	lvl: number,
}

type Props = {
	id: string
}

const StatsDefault: Stats = {
	wins: 0,
	total_games: 0,
	lvl: 0,
}

function ProfileStats(props: Props) {
	const [stats, setStats] = useState<Stats>(StatsDefault)
	const [ wins, setWins ] = useState(0);
	const [ loss, setLoss] = useState(0);


	const getStats = async () => {
		try {
			const result: AxiosResponse = await axios.post('/api/achievemeplug invite from friend listnts/stats', {id: props.id})
			setStats(result.data);
			setWins((result.data.wins / result.data.total_games) * 100);
			setLoss(((result.data.total_games - result.data.wins) / result.data.total_games) * 100);
		}
		catch(error) {
			console.log(error);
		}
	}
	useEffect(() => {
		getStats();
	}, [])
	return (
		<ul className="profile-game-stats">
			<li>
				<span style={{
					color: "#7070a5",
					fontSize: '.8em'
				}} >Total games</span>
				<span>{stats.total_games}</span>
			</li>
			<li>
				<span style={{
					color: "#7070a5",
					fontSize: '.8em'
				}}>Wins</span>
				<span>{`${wins}%`}</span>
			</li>
			<li>
				<span style={{
					color: "#7070a5",
					fontSize: '.8em'
				}}>Loss</span>
				<span>{`${loss}%`}</span>
			</li>
			<li>
				<span style={{
					color: "#7070a5",
					fontSize: '.8em'
				}}>Lvl</span>
				<span>{stats.lvl}</span>
			</li>
		</ul>
	)
}

export default ProfileStats;

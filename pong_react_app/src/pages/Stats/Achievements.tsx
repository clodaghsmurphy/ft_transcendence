import React, { useState, useEffect } from "react";
import axios, {AxiosResponse} from 'axios'
import AchievementList from "./AchievementsList";
import { CgUserList } from "react-icons/cg";
import { HiViewList } from "react-icons/hi";
import AllAchievements from "./AllAchievments";
import Loading from "../Components/Loading";
const { v4: uuidv4 } = require('uuid');

export type Achievement = {
	icon: string,		// Icon of the achievement
	title: string,		// Title of the achievement
	description: string,	// Description of the achievement
	id: number,			// Id of the achievement
	cap: number,		// Number of things to chieve the achievement
	score: number					// exemple: Win 10 games -> cap = 10
}

type Props = {
	id: string
}

let style_buttons = {
	"display": "flex",
	"alignItems": "center",
	"cursor": 'pointer',
}

function StatsAchievements(props: Props ) {
	const [achievement, setAchievements ] = useState< Achievement[] >([]);
	const [ isLoading, setIsLoading ] = useState(true);
	const [ listToggle, setListToggle ] = useState(1);
	// lsit toggle to toggle between my acheivememnts (1) and all acheivements 2

	useEffect(() => {
		getAchievements();
	}, [])

	const getAchievements = async () => {
		try {
			const result: AxiosResponse = await axios.post(`http://${window.location.hostname}:8080/api/achievements`, {id: parseInt(props.id)})
			setAchievements(result.data);
			setIsLoading(false)
		}
		catch(error) {}
	}

	if (isLoading)
	{
		return (
			<Loading />
		)
	}
		return (
			<>
			<div className="info-body">
				{
					listToggle === 1 ?
					< AchievementList ach={achievement} />
					: <AllAchievements ach={achievement} id={parseInt(props.id)}/>
				}

			</div>
				<div className="friends-option-bar">
					<div className='friends-toggle-button'  onClick={() => setListToggle(1)}>
						<CgUserList style={{ height: '4vh', cursor: 'pointer' }}/>
					</div>
					<div className='friends-toggle-button' onClick={() => setListToggle(2)}>
						<HiViewList style={{ height: '4vh', cursor: 'pointer' }} />
					</div>
				</div>
			</>
		);
	}


export default StatsAchievements;

import React, { useState, useEffect } from "react";
import axios, {AxiosResponse, AxiosError} from 'axios'
import Winner from '../../media/ach_icons/Winner.png'
import Addicted from '../../media/ach_icons/Addicted.png'
import Blah_blah from '../../media/ach_icons/Blah_blah.png'
import Bully from '../../media/ach_icons/Bully.png'
import Collector from '../../media/ach_icons/Collector.png'
import Community from '../../media/ach_icons/Community.png'
import First_Steps from '../../media/ach_icons/First_Steps.png'
import For_life from '../../media/ach_icons/For_life.png'
import Master from '../../media/ach_icons/Master.png'
import Newbie from '../../media/ach_icons/Newbie.png'
import OldFashioned from '../../media/ach_icons/Old-Fashioned.png'
import On_Fire from '../../media/ach_icons/On_Fire.png'
import Player from '../../media/ach_icons/Player.png'
import Serial_Streaker from '../../media/ach_icons/Serial_Streaker.png'
import Sharp_Shooter from '../../media/ach_icons/Sharp_Shooter.png'
import Striker from '../../media/ach_icons/Striker.png'
import Surpass_the_Masters from '../../media/ach_icons/Surpass_the_Masters.png'
import Who_can_stop_you from '../../media/ach_icons/Who_can_stop_you.png'
import Zoomer from '../../media/ach_icons/Zoomer.png'
import Legend from '../../media/ach_icons/Legend.png'
import { user } from "../../store/reducer";
import AchievementList from "./AchievementsList";
import { CgUserList } from "react-icons/cg";
import { HiViewList } from "react-icons/hi";
import AllAchievements from "./AllAchievments";

const { v4: uuidv4 } = require('uuid');

export type Achievement = {
	icon: string,		// Icon of the achievement
	title: string,		// Title of the achievement
	descripton: string,	// Description of the achievement
	id: number,			// Id of the achievement
	cap: number,		// Number of things to chieve the achievement
	score: number					// exemple: Win 10 games -> cap = 10
}


let style_buttons = {
	"display": "flex",
	"alignItems": "center",
	"cursor": 'pointer',
}

function StatsAchievements(id: string ) {
	const [achievement, setAchievements ] = useState< Achievement[] >([]);
	const [Allachievement, setAllAchievements ] = useState< Achievement[] >([]);
	const [ isLoading, setIsLoading ] = useState(true);
	const [ listToggle, setListToggle ] = useState(1);
	// lsit toggle to toggle between my acheivememnts (1) and all acheivements 2

	useEffect(() => {
		getAchievements();
	}, [])

	const getAchievements = async () => {
		try {
			const result: AxiosResponse = await axios.post(`http://${window.location.hostname}:8080/api/achievements`, {id: id})
			setAchievements(result.data);
			setIsLoading(false)
		}
		catch(error) {
			console.log(error);
		}
	}

	if (isLoading)
	{
		console.log('loading')
		return (
			<div>
				loading
			</div>
		)
	}
		return (
			<>
			<div className="info-body">
				{
					listToggle === 1 ? 
					< AchievementList ach={achievement} />
					: <AllAchievements ach={achievement} />
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
import React, { useEffect, Suspense } from "react";
import NavBar from "./NavBar"; 
import './stats.css';
import user_photo from './media/user.png';
import FTlogo from './media/42_Logo.png'
import { BsFillGearFill } from "react-icons/bs";
import tron_bg from './media/tron_bg.jpeg'
import { useState, useContext } from "react";
import { AuthContext } from "./App";
import GameHistory from './GameHistory';
import StatsAchievements from './Achievements';
import { Link } from 'react-router-dom'
import User, { id_to_user } from "./User";
import Popup from 'reactjs-popup';
import { usePrompt } from "./usePrompt";
import EnableTwoFAuth from "./EnableTWoFAuth";
import ChangeName from "./ChangeName";
import ChangePhoto from "./ChangePhoto";
import { blob } from "stream/consumers";
import test from './media/nguiard.jpg';
import ProfileStats from "./ProfileStats";
import Image from "./Image";


import Friends from "./Friends";


function Stats()
{
	const [open, setOpen] = useState(false);
	const { state, dispatch } = useContext(AuthContext);
	let [current_user, set_current_user] = useState({} as User);
	let [all_users, set_all_users] = useState([] as User[]);

	useEffect(() => {
		document.title = 'Chat';
		fetch('/api/user/info', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			}
		}).then((response) => {
			response.json()
				.then(data => {
					set_all_users(data as User[])
					set_current_user(id_to_user(all_users, Number(state.user.id))) // A changer par jsp quoi
				})
			})
	}, []);

	const handleOpen = () =>
	{
		setOpen(!open);
	};


	return(
			<>
			<Suspense>
				<NavBar />
			<div className="stats-page">
				<div className="stats">
					<div className="profile-header">
						<div className="profile-sub-header" >
							<ProfileStats />
						
						<div className="avatar-stats">
								<Image id={state.user.id} />
							<span className="user-name">{state.user.name}</span>

						</div>
						<div className='right-options'>
							<div className="drop-down" >
									<BsFillGearFill style={{ color: 'white', height: 'calc(1em + 1vw)'} } onClick={handleOpen}/>
								{ open ? (
								<ul className="options-list">
									<ChangePhoto />
									<ChangeName />
									<EnableTwoFAuth />
									
								</ul> ) : null}
								
							</div>
								<Link to={"https://profile.intra.42.fr/users/" + state.user.name} className='ftlogo'>
									<img src={FTlogo} />
								</Link>
						</div>
					</div>

					</div>
					<div className="sub-stats">
						<div className="info-card game-history">
							<header>
								<h1>Game History</h1>
							</header>
							{GameHistory(all_users, current_user)}
						</div>
						<div className="info-card friends">
							<header>
								<h1>Achievements</h1>
							</header>
							{StatsAchievements(current_user)}
						</div>
						<Friends />
						
					</div>
				</div>
			</div>
		</Suspense>
		</>
	);
}


export default Stats;
import React, { useEffect } from "react";
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
import StatsFriends from "./StatsFriends";
import { Link } from 'react-router-dom'
import User, { name_to_user } from "./User";
import Popup from 'reactjs-popup';
import { usePrompt } from "./usePrompt";
import EnableTwoFAuth from "./EnableTWoFAuth";


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
					set_current_user(name_to_user(all_users, state.user.login)) // A changer par jsp quoi
				})
			})
	}, []);

	const handleOpen = () =>
	{
		setOpen(!open);
	};

	const changePhoto = () =>
	{

	}
	const {triggerPrompt } = usePrompt();

	const changeName = () =>
	{

		triggerPrompt({
			title: "Name change",
			text: "Please enter a new name",
			isInput: true,
			onSubmit: (input: string) => console.log(input)
		})
	}

	return(
			<>
				<NavBar />
			<div className="stats-page">
				<div className="stats">
					<div className="profile-header">
						<div className="profile-sub-header" >
						<ul className="profile-game-stats">
								<li>
									<span style={{color: "#7070a5",
								fontSize: '.9em'}} >Total games</span>
									<span>13</span>	
								</li>
								<li>
									<span style={{ color: "#7070a5",
										fontSize: '.9em' }}>Wins</span>
									<span>85%</span>
								</li>
								<li>
									<span style={{ color: "#7070a5",
										fontSize: '.9em' }}>Loss</span>
									<span>15%</span>
								</li>
						</ul>
						<div className="avatar-stats">
								<img style={{
								}}src={state.user.avatar} />
							<span className="user-name">{state.user.login}</span>

						</div>
						<div className='right-options'>
							<div className="drop-down" >
								<BsFillGearFill style={ {color: 'white', height: '3vh'} } onClick={handleOpen}/>
								{ open ? (
								<ul className="options-list">
									<li className="options-list-item" onClick={changePhoto}>Change photo</li >
									<li className="options-list-item" onClick={changeName}>Change Name</li >
									<EnableTwoFAuth />
									
								</ul> ) : null}
								
							</div>
								<Link to={"https://profile.intra.42.fr/users/" + state.user.login} className='ftlogo'>
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
						<div className="info-card game-history">
							<header>
								<h1>Friends</h1>
							</header>
							{StatsFriends(all_users, current_user)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}


export default Stats;
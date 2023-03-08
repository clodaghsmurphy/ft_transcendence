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
import Leaderboard from "./LeaderBoard";
import StatsFriends from "./StatsFriends";
import User, { name_to_user } from "./User";

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
									width: "150px",
									height: "150px",
									minWidth: "150px",
									minHeight: "150px",
									maxWidth: "150px",
									maxHeight: "150px",
									alignSelf: "center",
								}}src={state.user.avatar} />
							<span className="user-name">{state.user.login}</span>

						</div>
						<div className='right-options'>
							<div className="drop-down" onClick={handleOpen}>
								<BsFillGearFill style={ {color: 'white', height: '3vh'} }/>
								{ open ? (
								<ul className="options-list">
									<li className="options-list-item">Change photo</li>
									<li className="options-list-item">Delete account</li>
								</ul> ) : null}
							</div>
								<a className='ftlogo'>
									<img src={FTlogo} />
								</a>
						</div>
					</div>

					</div>
					<div className="sub-stats">
						<div className="info-card game-history">
							<header>
								<h1>Game History</h1>
							</header>
							<GameHistory />
						</div>
						<div className="info-card friends">
							<header>
								<h1>Achievements</h1>
							</header>
							<Leaderboard />
						</div>
						<div className="info-card game-history">
							<header>
								<h1>Friends</h1>
							</header>
							<StatsFriends />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}


export default Stats;
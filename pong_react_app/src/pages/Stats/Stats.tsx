import React, { useEffect, Suspense } from "react";
import NavBar from "../Components/NavBar"; 
import './stats.css';
import FTlogo from '../../media/42_Logo.png'
import { BsFillGearFill } from "react-icons/bs";
import { useState, useContext } from "react";
import { AuthContext } from "../../App";
import StatsAchievements from './Achievements';
import { Link } from 'react-router-dom'
import EnableTwoFAuth from "./EnableTWoFAuth";
import ChangeName from "./ChangeName";
import ChangePhoto from "./ChangePhoto";
import ProfileStats from "./ProfileStats";
import Image from "../Components/Image";
import { ActionKind } from "../../store/reducer"
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import Friends from "./Friends";
import GameHistory from "./GameHistory";

type Props ={
	error?:string,
}
function Stats(props:Props)
{
	const [open, setOpen] = useState(false);
	const [error, setError ] = useState('');
	const { state, dispatch } = useContext(AuthContext);

	useEffect(() => {
		document.title = 'Stats';
		if (state.error)
		{
			const error = state.error;
			setError(error.message)
			dispatch({
				type:ActionKind.errorUpdate,
				payload: null
			})
		}
		
		axios.get('/api/user/info/' + state.user.id)
		.then(() => {})
		.catch(() => {
			axios.post(`http://${window.location.hostname}:8080/api/auth/logout`)
				.then(() => {})
				.catch(() => {})
			dispatch ({
				type: ActionKind.Logout
			});
			localStorage.clear();
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
				< ToastContainer theme="colored" />
				{error && <div className='error-bar'>{error}</div> }
			<div className="stats-page">
				<div className="stats">
					<div className="profile-header">
						<div className="profile-sub-header" >
							<ProfileStats id={state.user.id}/>
						
						<div className="avatar-stats">
								<Image id={parseInt(state.user.id)} status={0}/>
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
						</div>
					</div>

					</div>
					<div className="sub-stats">
						<div className="info-card game-history">
							<header>
								<h1>Game History</h1>
							</header>
							<GameHistory id={parseInt(state.user.id)}/>		
						</div>
						<div className="info-card friends">
							<header>
								<h1>Achievements</h1>
							</header>
								<StatsAchievements id={state.user.id} />
							
						</div>
						<Friends id={state.user.id}/>
						
					</div>
				</div>
			</div>
		</Suspense>
		</>
	);
}


export default Stats;
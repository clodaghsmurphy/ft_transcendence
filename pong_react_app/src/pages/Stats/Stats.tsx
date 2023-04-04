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

import Friends from "./Friends";

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
	}, []);

	

	const handleOpen = () =>
	{
		setOpen(!open);
	};


	return(
			<>
			<Suspense>
				<NavBar />
				{error && <div className='error-bar'>{error}</div> }
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
						
						</div>
						<div className="info-card friends">
							<header>
								<h1>Achievements</h1>
							</header>
								{StatsAchievements(state.user)}
							
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
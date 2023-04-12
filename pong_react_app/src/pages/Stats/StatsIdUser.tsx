import React from 'react';
import Friends from "./Friends";
import NavBar from "../Components/NavBar"; 
import ProfileStats from "./ProfileStats";
import StatsAchievements from './Achievements';
import { user } from '../../store/reducer';
import FTlogo from '../../media/42_Logo.png'
import { Link } from 'react-router-dom'

type Props = {
    usr: user
}

function StatsIdUser(props: Props) {
    const usr = props.usr;
    
    return (
        <>
			<NavBar />
			<div className="stats-page">
				<div className="stats">
					<div className="profile-header">
						<div className="profile-sub-header" >
							<ProfileStats id={usr.id}/>
						
						<div className="avatar-stats">
								<img style={{
								}}src={usr.avatar} alt="avatar"/>
							<span className="user-name">{usr.name}</span>

						</div>
						<div className='right-options'>
								
								<Link to={"https://profile.intra.42.fr/users/" + usr.name} className='ftlogo'>
									<img src={FTlogo} alt="42 logo"/>
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
							{StatsAchievements(usr.id)}
						</div>
						 <Friends id={usr.id}/>
					</div>
				</div>
			</div>
			</>
    )
}

export default StatsIdUser;
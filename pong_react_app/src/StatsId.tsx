import React, { useEffect, Suspense } from "react";
import NavBar from "./NavBar"; 
import './stats.css';
import FTlogo from './media/42_Logo.png'
import { BsFillGearFill } from "react-icons/bs";
import tron_bg from './media/tron_bg.jpeg'
import { useState, useContext } from "react";
import { AuthContext } from "./App";
import GameHistory from './GameHistory';
import StatsAchievements from './Achievements';
import { Link, useParams, useNavigate } from 'react-router-dom'
import User, { id_to_user } from "./User";
import EnableTwoFAuth from "./EnableTWoFAuth";
import ChangeName from "./ChangeName";
import ChangePhoto from "./ChangePhoto";
import ProfileStats from "./ProfileStats";
import axios, { AxiosResponse, AxiosError} from 'axios';
import { user } from "./store/reducer";
import { ErrorObject, ActionKind } from "./store/reducer";


import Friends from "./Friends";


function StatsId()
{
	const [open, setOpen] = useState(false);
	const { state, dispatch } = useContext(AuthContext);
	let	[user, setUser] = useState<user>();
	const [ error, setError] = useState("");
	const id = useParams();
	const navigate = useNavigate();


	useEffect(() => {
		document.title = 'Stats';
		axios.get(`http://localhost:8080/api/user/info/${id.id}`)
		.then(function(response:AxiosResponse){
			console.log(response.data);
			const res = response.data;
			 setUser({...user, name:res.name, id:res.id, avatar:`http://${window.location.hostname}:8080/api/user/image/${res.id}`, otp_enabled:res.otp_enabled})
			 console.log(user)
		})
		.catch(function(e:AxiosError) {
			console.log(e);
			const errorObj:ErrorObject = {
				type: 'StatsId',
				message: e.message,
			}
			dispatch({
				type: ActionKind.errorUpdate,
				payload: errorObj
			})
			navigate('/stats')
		})
	}, []);

	const handleOpen = () =>
	{
		setOpen(!open);
	};


	return(
			<>
			{ user &&
			<Suspense>
				<NavBar />
			<div className="stats-page">
				<div className="stats">
					<div className="profile-header">
						<div className="profile-sub-header" >
							<ProfileStats />
						
						<div className="avatar-stats">
								<img style={{
								}}src={user.avatar} />
							<span className="user-name">{user.name}</span>

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
								<Link to={"https://profile.intra.42.fr/users/" + user.name} className='ftlogo'>
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
							{StatsAchievements(user)}
						</div>
						<Friends />
						
					</div>
				</div>
			</div>
		</Suspense>
		} 
		</>
	);
}


export default StatsId;
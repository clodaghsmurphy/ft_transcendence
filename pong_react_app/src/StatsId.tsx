import React, { useEffect, Suspense, useState, useContext } from "react";
import NavBar from "./NavBar"; 
import './stats.css';
import FTlogo from './media/42_Logo.png'
import { BsFillGearFill } from "react-icons/bs";
import { AuthContext } from "./App";
import StatsAchievements from './Achievements';
import { Link, useParams, useNavigate } from 'react-router-dom'
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
	const emptyUser:user = {
		name:'',
		id: '',
		otp_enabled: false,
		avatar: '',
	}
	const [open, setOpen] = useState(false);
	const { state, dispatch } = useContext(AuthContext);
	const [usr, setUser] = useState<user>(emptyUser);
	const [ error, setError] = useState("");
	const id = useParams();
	const navigate = useNavigate();
	const [ loaded , setLoaded] = useState(false);


	useEffect(() => {
		document.title = 'Stats';
		axios.get(`http://localhost:8080/api/user/info/${id.id}`)
		.then(function(response:AxiosResponse){
			console.log(response.data);
			 const res = response.data;
			 const updateValue:user = { name: res.name, id: res.id, avatar: res.avatar, otp_enabled: res.otp_enabled }
			 console.log(updateValue)
			 setUser(updateValue)
			// console.log(user)
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


	useEffect(() => {
		console.log('user!@', usr);
		//setLoaded(true);
	}, [usr]);

	const handleOpen = () =>
	{
		setOpen(!open);
	};


	return(
			<>
			{ usr &&
			<Suspense>
				<NavBar />
			<div className="stats-page">
				<div className="stats">
					<div className="profile-header">
						<div className="profile-sub-header" >
							<ProfileStats />
						
						<div className="avatar-stats">
								<img style={{
								}}src={usr.avatar} />
							<span className="user-name">{usr.name}</span>

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
								<Link to={"https://profile.intra.42.fr/users/" + usr.name} className='ftlogo'>
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
							{StatsAchievements(usr)}
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
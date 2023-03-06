import React from "react";
import NavBar from "./NavBar"; 
import './stats.css';
import user_photo from './media/user.png';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import FTlogo from './media/42_Logo.jpeg'
import { BsFillGearFill } from "react-icons/bs";

function Stats()
{
	return(
		
			<>
				<NavBar />
			<div className="stats-page">
				<div className="stats">
					<div className="profile-header">
					<div className="profile-sub-header">
						<ul className="profile-game-stats">
								<li>
									<span>Total games</span>
									<span>13</span>	
								</li>
								<li>
									<span>Wins</span>
									<span>85%</span>
								</li>
								<li>
									<span>Loss</span>
									<span>15%</span>
								</li>
						</ul>
						<div className="avatar-stats">
							<img src={user_photo} />
							<span className="user-name">Clmurphy</span>

						</div>
						<div className='drop-down'>
								<Dropdown>
									<Dropdown.Toggle variant="success" id="dropdown-basic">
										<BsFillGearFill />
									</Dropdown.Toggle>

									<Dropdown.Menu>
										<Dropdown.Item href="#/action-1">Action</Dropdown.Item>
										<Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
										<Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
						</div>
							
						<a>
							<img src={FTlogo}/>
						</a>
					</div>

					</div>
					<div className="sub-stats">
						<div className="info-card game-history">
							<h1>Game History</h1>
						</div>
						<div className="info-card friends">
							<h1>Leaderboard</h1>
						</div>
						<div className="info-card game-history">
							<h1>Friends</h1>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}


export default Stats;
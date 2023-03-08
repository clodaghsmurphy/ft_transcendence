import React from "react";
import gameAvatar from './media/nguiard.jpg';
import { TbUserSearch } from "react-icons/tb";

function Leaderboard() {
	return (
		<div className="info-body">
			<div className="search-bar">
				<input className='search-bar' placeholder={'Search friends..'} />
				<TbUserSearch style={{ position: 'absolute', left: '40%', margin: '1vh' }} />
			</div>
			<div className="info-item">
				<div className="ranking"> #1 </div>
				<div className="leaderboard-avatar">
					<img src={gameAvatar} />
				</div>
				<span className="rank-username">nguiard</span>
			</div>
			<div className="info-item"></div>
			<div className="info-item"></div>
		</div>
	);
}

export default Leaderboard;
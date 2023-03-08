import React from "react";
import gameAvatar from './media/nguiard.jpg'
import { RiPingPongLine } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import { TbUserSearch } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";

function StatsFriends() {
	return (
		<div className="info-body">
			<div className="search-bar">
				<input className='search-bar' placeholder={'Search friends..'}/>
				<TbUserSearch style={ { position: 'absolute', left: '40%', margin: '1vh'}}/>
			</div>
			<div className="info-item">
				<div className="friends-avatar">
					<img src={gameAvatar} />
				</div>
				<span className="rank-username">nguiard</span>
				<div className="friends-options">
					<div className="play">
						<RiPingPongLine style={{ height: '4vh', cursor:'pointer' }} />
					</div>
					<div className="delete">
						<TiDelete style={{ height: '4vh', cursor: 'pointer'}}/>
					</div>
					<div className="friend-profile">
						<CgProfile style={{ height: '4vh', cursor: 'pointer' }} />
					</div>
				</div>
			</div>
			<div className="info-item"></div>
			<div className="info-item"></div>
		</div>
	);
}

export default StatsFriends;
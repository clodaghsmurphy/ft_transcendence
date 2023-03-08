import React from "react";
import gameAvatar from './media/nguiard.jpg'
import { RiPingPongLine } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import { TbUserSearch } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";

function StatsFriends() {
	let style_buttons = {
		"display": "flex",
		"alignItems": "center",
	}
	return (
		<div className="info-body">
			<div className="info-item">
				<div className="stats-avatar">
					<img src={gameAvatar} />
				</div>
				<span className="game-username">nguiard</span>
				<div className="friends-options">
					<div style={style_buttons} className="play">
						<RiPingPongLine style={{ height: '4vh', cursor:'pointer' }} />
					</div>
					<div style={style_buttons} className="delete">
						<TiDelete style={{ height: '4vh', cursor: 'pointer'}}/>
					</div>
					<div style={style_buttons} className="friend-profile">
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
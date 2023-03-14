import React, { useState } from "react";
import gameAvatar from './media/nguiard.jpg'
import { RiPingPongLine } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import { TbUserSearch } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { Link } from 'react-router-dom';
import { IconContext } from "react-icons";
import User from "./User";
const { v4: uuidv4 } = require('uuid');

function FriendButton(target: User): JSX.Element {
	let style_buttons = {
		"display": "flex",
		"alignItems": "center",
	}

	return (
		<div className="info-body" key={uuidv4()}>
			<div className="info-item">
				<div className="stats-avatar">
					<img src={target.avatar} />
				</div>
				<span className="game-username">{target.name}</span>
				<IconContext.Provider value={{
					color: "white",
				}}>
					<div className="friends-options">
						<Link to={"/game/" + target.game_id} style={style_buttons} className="play">
							<RiPingPongLine style={{ height: '4vh', cursor:'pointer' }} />
						</Link>
						<div style={style_buttons} className="delete">
							<TiDelete style={{ height: '4vh', cursor: 'pointer'}}/>
						</div>
						<Link to={"/stats/" + target.name}style={style_buttons} className="friend-profile">
							<CgProfile style={{ height: '4vh', cursor: 'pointer' }} />
						</Link>
					</div>
				</IconContext.Provider>
			</div>
		</div>
	);
}

function StatsFriends(every_user: User[], current_user: User): JSX.Element {
	let [friendsBlocks, setFriendsBlocks] = useState([] as JSX.Element[])

	if (typeof current_user === 'undefined' || typeof every_user[0] === 'undefined')
		return <div key={uuidv4()}/>

	let friends = every_user.filter(usr => current_user.friend_users.includes(usr.id));

	for (const usr of friends) {
		let tmp = friendsBlocks;
		tmp.push(FriendButton(usr))
		setFriendsBlocks(tmp);
	}

	return (
		<div className="info-body">
			{friendsBlocks}
		</div>
	);
}

export default StatsFriends;
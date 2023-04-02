import React, { useEffect, useState } from "react";
import gameAvatar from './media/nguiard.jpg'
import { RiPingPongLine } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import { TbUserSearch } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { Link } from 'react-router-dom';
import { IconContext } from "react-icons";
import User from "./User";
import axios, { AxiosError, AxiosResponse } from 'axios'
import { friendUser } from "./AddFriends";

const { v4: uuidv4 } = require('uuid');

let style_buttons = {
	"display": "flex",
	"alignItems": "center",
}
function StatsFriends(): JSX.Element {
	let [ friends, setFriends ] = useState<friendUser[]>([]);

	

	useEffect( () => {
		console.log('in friends use effects');
		getFriends();
	}, [])

	const getFriends = async () => {
		axios.get(`http://${window.location.hostname}:8080/api/user/friends`,
			{ headers: {
				Authorization: token,
			} })
			.then(function (res: AxiosResponse) {
				console.log(res)
				setFriends(res.data)
			})
			.catch((error: AxiosError) => console.log(error));
	}

	async function deleteFriend(id: number) {
		axios.post(`http://${window.location.hostname}:8080/api/user/delete-friend`, {id: id})
		.then(function(response){
			console.log(response);
			setFriends(response.data);
		})
		.catch((e:AxiosError) => console.log(e));
	}

	return (
			<div className="info-body" key={uuidv4()}>
				{ friends.map (usr => 
					<div className="info-item" key={usr.id}>
					<div className="stats-avatar">
						<img src={`http://${window.location.hostname}:8080/api/user/image/${usr.id}`} />
					</div>
					<span className="game-username">{usr.name}</span>
					<IconContext.Provider value={{
						color: "white",
					}}>
						<div className="friends-options">
							<Link to={"/game/" + usr.game_id} style={style_buttons} className="play">
								<RiPingPongLine style={{ height: '4vh', cursor: 'pointer' }} />
							</Link>
							<div style={style_buttons} className="delete" onClick={(e) => deleteFriend(usr.id)}>
								<TiDelete style={{ height: '4vh', cursor: 'pointer' }} />
							</div>
							<Link to={"/stats/" + usr.name} style={style_buttons} className="friend-profile">
								<CgProfile style={{ height: '4vh', cursor: 'pointer' }} />
							</Link>
						</div>
					</IconContext.Provider>
				</div> )}
			</div>
	);
}

export default StatsFriends;
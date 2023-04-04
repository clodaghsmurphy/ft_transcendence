import React, { useEffect, useState, useContext } from "react";
import { RiPingPongLine } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import { CgProfile } from "react-icons/cg";
import { Link } from 'react-router-dom';
import { IconContext } from "react-icons";
import axios, { AxiosError, AxiosResponse } from 'axios'
import { friendUser } from "./AddFriends";
import { AuthContext } from "../../App";

const { v4: uuidv4 } = require('uuid');

let style_buttons = {
	"display": "flex",
	"alignItems": "center",
}

 type Props = {
	id: string,
}

function StatsFriends(props:Props): JSX.Element {
	let [ friends, setFriends ] = useState<friendUser[]>([]);
	const { state, dispatch } = useContext(AuthContext);

	const isCurrent = (props.id === state.user.id);	

	useEffect( () => {
		getFriends();
	}, [])

	const getFriends = async () => {
		console.log('Props id is ',props.id);
		axios.get(`http://${window.location.hostname}:8080/api/user/friends/${props.id}`,
			)
			.then(function (res: AxiosResponse) {
				setFriends(res.data)
			})
			.catch((error: AxiosError) => console.log(error));
	}

	async function deleteFriend(id: number) {
		axios.post(`http://${window.location.hostname}:8080/api/user/delete-friend`, {id: id})
		.then(function(response:AxiosResponse){
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
						<img src={`http://${window.location.hostname}:8080/api/user/image/${usr.id}`} alt="avatar"/>
					</div>
					<span className="game-username">{usr.name}</span>
					<IconContext.Provider value={{
						color: "white",
					}}>
						<div className="friends-options">
							<Link to={"/game/" + usr.game_id} style={style_buttons} className="play">
								<RiPingPongLine style={{ height: '4vh', cursor: 'pointer' }} />
							</Link>
							{ isCurrent && <div style={style_buttons} className="delete" onClick={(e) => deleteFriend(usr.id)}>
								<TiDelete style={{ height: '4vh', cursor: 'pointer' }} />
							</div> }
							<Link to={"/stats/" + usr.id} style={style_buttons} className="friend-profile">
								<CgProfile style={{ height: '4vh', cursor: 'pointer' }} />
							</Link>
						</div>
					</IconContext.Provider>
				</div> )}
			</div>
	);
}

export default StatsFriends;
import React from "react";
import { useState, useEffect } from 'react';
import { friendUser } from "./AddFriends";
import { CgUnblock} from 'react-icons/cg';
import Image from "../Components/Image";
import axios, { AxiosError, AxiosResponse } from 'axios'


const { v4: uuidv4 } = require('uuid');

function BlockedUsers() {
	const [ blockedUsers, setBlockedUsers] = useState<friendUser[]>([]);

	useEffect( () => {
		getBlocked();
	}, [])

	const getBlocked = async () => {
		axios.get(`http://${window.location.hostname}:8080/api/user/blocked-users`,
			)
			.then(function (res: AxiosResponse) {
				setBlockedUsers(res.data)
			})
			.catch((error: AxiosError) => {});
	}


	const unblock = async (id:number) => {
		axios.post(`http://${window.location.hostname}:8080/api/user/unblock-friend`, {id: id})
		.then(function(response:AxiosResponse){
			setBlockedUsers(response.data);
		})
		.catch((e:AxiosError) => {});
	}
	let style_buttons = {
		"display": "flex",
		"alignItems": "center",
		"cursor": 'pointer',
	}

	return (
		<div className="info-body" key={uuidv4()}>
			{ blockedUsers.map (usr => 
				<div className="info-item" key={usr.id}>
				<div className="stats-avatar">
					<Image id={usr.id} status={1}/>
				</div>
				<span className="game-username">{usr.name}</span>
					<div className="friends-options">
						<div style={style_buttons} className="delete" onClick={(e) => unblock(usr.id)}>
							<CgUnblock style={{ height: '4vh', cursor: 'pointer' }} />
						</div>
					</div>
			</div> )}
		</div>
);
}

export default BlockedUsers;
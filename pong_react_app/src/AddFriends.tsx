import React from 'react'
import { useState, useEffect, useMemo } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Link } from 'react-router-dom';
import { RiPingPongLine } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import { IconContext } from "react-icons";
import { BsPersonAdd } from "react-icons/bs";

type Props = {
	value:string
}

type friendUser = {
	name:string,
	id: number,
	avatar:string
}

function AddFriends(props: Props){
	let [ users, setUsers ] = useState<friendUser[]>([]);
	
	const { v4: uuidv4 } = require('uuid');

	useEffect( () => {
		console.log('in use effects')
		axios.get(`http://${window.location.hostname}:8080/api/user/users`, { data: props.value })
			.then(function (response:AxiosResponse) {
				 console.log(response);
				 setUsers(response.data);
			})
			.catch((error: AxiosError) => console.log(error))
	}, [])


	useEffect(() => {
		console.log(props.value);
		if (props.value)
		{
			axios.get(`http://${window.location.hostname}:8080/api/user/friends-search`, { data: props.value })
			.then((response:AxiosResponse) => console.log(response))
			.catch((error:AxiosError) => console.log(error))
		}
		else
		{
			axios.get(`http://${window.location.hostname}:8080/api/user/users`, { data: props.value })
			.then(function (response:AxiosResponse) {
				 console.log(response);
				 if (!users){
				 	setUsers(response.data);
				 }
			})
			.catch((error: AxiosError) => console.log(error))
		}
	}, [props.value])


	let style_buttons = {
		"display": "flex",
		"alignItems": "center",
	}

	return (
		<div className="info-body">
			{ users.map(usr =>
			<div className="info-item">
					<div className="stats-avatar">
						<img src={`http://${window.location.hostname}:8080/api/user/image/${usr.id}`}/>
					</div>
				<span className="game-username">{usr.name}</span>
				<IconContext.Provider value={{
					color: "white",
				}}>
					<div className="friends-options">
						<Link to={"/stats/" + usr.name} style={style_buttons} className="friend-profile">
							<BsPersonAdd style={{ height: '4vh', cursor: 'pointer' }} />
						</Link>
					</div>
				</IconContext.Provider>
			</div>)}
		</div>
	)
}
export default AddFriends;
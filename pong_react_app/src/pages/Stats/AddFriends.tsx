import React from 'react'
import { useState, useEffect, useMemo } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { IconContext } from "react-icons";
import { AiOutlineUserAdd } from "react-icons/ai";

type Props = {
	value:string
}

export type friendUser = {
	name:string,
	id: number,
	avatar:string
	game_id?:number
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
			console.log(props.value);
			axios.post(`http://${window.location.hostname}:8080/api/user/friends-search`, {
				data: {
					value: props.value 
				}
			})
			.then(function (response:AxiosResponse) {
				setUsers(response.data);
			}) 
			.catch((error:AxiosError) => console.log(error))
		}
		else
		{
			axios.get(`http://${window.location.hostname}:8080/api/user/users`)
			.then(function (response:AxiosResponse) {
				 console.log(response);
				setUsers(response.data);	 
			})
			.catch((error: AxiosError) => console.log(error))
		}
	}, [props.value])

	async function add(id: number) {
		console.log('in add');
		axios.post(`http://${window.location.hostname}:8080/api/user/add-friend`, { data: {
			id:id
		}})
		.then((response:AxiosResponse) => console.log(response))
		.catch((error:AxiosError) => console.log(error))
	}

	let style_buttons = {
		"display": "flex",
		"alignItems": "center",
		"cursor": 'pointer',
	}

	return (
		<div className="info-body">
			{ users.map(usr =>
			<div className="info-item" key={usr.id}>
					<div className="stats-avatar">
						<img src={`http://${window.location.hostname}:8080/api/user/image/${usr.id}`} alt="avatar"/>
					</div>
				<span className="game-username">{usr.name}</span>
				<IconContext.Provider value={{
					color: "white",
				}}>
					<div className="friends-options">
						<div style={style_buttons} className="friend-profile" onClick={() => add(usr.id)}> 
							<AiOutlineUserAdd style={{ height: '4vh', cursor: 'pointer' }} />
						</div>
					</div>
				</IconContext.Provider>
			</div>)}
		</div>
	)
}
export default AddFriends;
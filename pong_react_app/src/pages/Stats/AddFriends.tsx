import React from 'react'
import { useState, useEffect, useMemo } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import {BiBlock }from "react-icons/bi"
import { AiOutlineUserAdd } from "react-icons/ai";
import Image from '../Components/Image';

type Props = {
	value:string
}

export type friendUser = {
	name:string,
	id: number,
	avatar:string,
	game_id?:number,
	in_game?: number,
	connected: boolean
}

function AddFriends(props: Props){
	let [ users, setUsers ] = useState<friendUser[]>([]);
	
    	useEffect( () => {
		axios.get(`http://${window.location.hostname}:8080/api/user/users`, { data: props.value })
			.then(function (response:AxiosResponse) {
				 setUsers(response.data);
			})
			.catch((error: AxiosError) => console.log(error))
	}, [])


	useEffect(() => {
		if (props.value)
		{
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
			getUsers();
		}
	}, [props.value])

	const getUsers = async () => {
		axios.get(`http://${window.location.hostname}:8080/api/user/users`)
			.then(function (response:AxiosResponse) {
				setUsers(response.data);	 
			})
			.catch((error: AxiosError) => console.log(error))
	}

	async function add(id: number) {
		axios.post(`http://${window.location.hostname}:8080/api/user/add-friend`, { data: {
			id:id
		}})
		.then((response:AxiosResponse) => {
			getUsers();
		})
		.catch((error:AxiosError) => console.log(error))
	}

	async function block(id: number) {
		axios.post(`http://${window.location.hostname}:8080/api/user/block-user`, { data: {
			id:id
		}})
		.then((response:AxiosResponse) => {
			getUsers();
		})
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
						<Image id={usr.id} status={0}/>
					</div>
				<span className="game-username">{usr.name}</span>
				
					<div className="friends-options">
						<div className="friends-toggle-button" onClick={() => add(usr.id)}> 
							<AiOutlineUserAdd style={{ height: '4vh', cursor: 'pointer' }} />
						</div>
						<div className="friends-toggle-button"  onClick={() => block(usr.id)}> 
							<BiBlock style={{ height: '4vh', cursor: 'pointer' }} />
						</div>
					</div>
			</div>)}
		</div>
	)
}
export default AddFriends;
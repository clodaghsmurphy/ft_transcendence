import React from 'react'
import { useState, useEffect, useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import { Link } from 'react-router-dom';
import { RiPingPongLine } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import { IconContext } from "react-icons";
import { CgProfile } from "react-icons/cg";

type Props = {
	value:string
}

type friendUser = {
	name:string,
	id: number,
	avatar:string
}

function AddFriends(props: Props){
	let [ friendsSuggestions, setFriendSuggestions ] = useState([] as JSX.Element[]);
	
	const { v4: uuidv4 } = require('uuid');

	function FriendBlock(target: friendUser): JSX.Element {
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
							<div style={style_buttons} className="delete">
								<TiDelete style={{ height: '4vh', cursor: 'pointer' }} />
							</div>
							<Link to={"/stats/" + target.name} style={style_buttons} className="friend-profile">
								<CgProfile style={{ height: '4vh', cursor: 'pointer' }} />
							</Link>
						</div>
					</IconContext.Provider>
				</div>
			</div>
		);
	}

	useEffect(() => {
		console.log(props.value);
		setFriendSuggestions([]);
		if (props.value)
		{
			axios.get(`http://${window.location.hostname}:8080/api/user/friends-search`, { data: props.value })
			.then((response) => console.log(response))
			.catch((error:AxiosError) => console.log(error))
		}
		else
		{
			axios.get(`http://${window.location.hostname}:8080/api/user/users`, { data: props.value })
			.then(function (response) {
				 console.log(response);
				 let tmp = response.data.map()
				 for(const usr of response.data)
				 {
					let tmp = friendsSuggestions;
					console.log(usr);			
					tmp.push(FriendBlock(usr));
				}
			})
			.catch((error: AxiosError) => console.log(error))
		}
	}, [props.value])
	return (
		<div className="info-body">
			{friendsSuggestions}
		</div>
	)
}
export default AddFriends;
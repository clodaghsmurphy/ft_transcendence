import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import User from './User'
import NavBar from './NavBar'
import './Friends.css'

const { v4: uuidv4 } = require('uuid');

function one_friend(usr: User): JSX.Element {
	let status_text = usr.in_game ? 
		usr.name + " is in game" :
		usr.name + " is not in game";
	let button_text = usr.in_game ? "Join" : "Invite"
	return (
		<div key={uuidv4()} className='one-friend'>
			<Link to={'/stats/' + usr.name} className='CNI'>
				<img src={usr.avatar} alt={usr.name}></img>
				<h2>{usr.name}</h2>
				<span className='status' style={usr.connected ? {backgroundColor: 'green'} : {}}>{usr.connected ? "online" : "offline" }</span>
			</Link>

			<div>
				<div className='game-status'>
					<div>{status_text}</div>
					<button>{button_text}</button>
				</div>
			</div>
		</div>
	)
}

function display_friends(all_friends: User[]): JSX.Element[] {
	let ret: JSX.Element[] = [];

	for (const user of all_friends) {
		ret.push(one_friend(user))
	}

	return ret
}

export default function Friends() {
	let [all_users, set_all_users] = useState([] as User[])
	let [curr_user, set_curr_user] = useState({} as User)

	useEffect (() => {
		fetch('/api/user/info')
		.then((response) => {
			response.json()
				.then((data) => {
						set_all_users(data as User[])
						set_curr_user(data[1] as User)
				})
		})
	}, []);
	
	return (
		<div className="dashboard">
        	<NavBar /> 
        	<main className="page-wrapper">
				<div className='friends-container'>
					<h1>Friends</h1>
					
					<div className='holder'>
						{display_friends((typeof all_users[0] === 'undefined')
							? [] : all_users.filter((usr: User) =>
							curr_user.friend_users.includes(usr.name)))}
					</div>
				</div>
			</main>
        </div>
	)
}
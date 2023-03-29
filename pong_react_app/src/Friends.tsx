import React from "react";
import { BiMessageAltError } from "react-icons/bi";
import { AiOutlineSearch } from 'react-icons/ai'
import { VscAdd } from "react-icons/vsc";
import { FaUserFriends } from "react-icons/fa";
import { useState, useEffect } from 'react';
import StatsFriends from "./StatsFriends";
import AddFriends from "./AddFriends";
import FriendRequests from "./FriendRequest";

function Friends() {
	const  [ title, setTitle ] = useState('Friends');
	const [value, setValue] = useState('');

	// useEffect(() =>{
	// 	input.focus()
	// }, [title])

	const inputChange = (e:React.ChangeEvent<HTMLInputElement>) =>
	{
		setValue(e.target.value);
	}
	return (
		<div className="info-card game-history">
			<header>
				<h1>{title}</h1>
			</header>
			<div className='search-bar'>
				<AiOutlineSearch />
				<input type='text' placeholder="Search..." autoFocus value={value} onChange={inputChange}/>
			</div>
			{title == 'Friends' ? <StatsFriends /> : title == 'Friend Requests' ? <FriendRequests value={value} /> : <AddFriends value={value} />}
			<footer className='friends-option-bar'>
				<button className='friends-toggle-button' onClick={() => setTitle('Friends')}>
					<FaUserFriends />
				</button>
				<button className='friends-toggle-button' onClick={() => setTitle('Friend Requests')}>
					<BiMessageAltError />
				</button>
				<button className='friends-toggle-button' onClick={() => setTitle('Add Friends')}>
					<VscAdd />
				</button>
			</footer>
		</div>
	);
}

export default Friends;
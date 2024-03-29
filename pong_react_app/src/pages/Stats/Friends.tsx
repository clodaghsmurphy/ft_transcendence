import React from "react";
import { AiOutlineSearch } from 'react-icons/ai'

import { useState, useContext } from 'react';
import StatsFriends from "./StatsFriends";
import AddFriends from "./AddFriends";
import BlockedUsers from "./BlockedUsers";
import { AuthContext } from "../../App";
import FriendsButtons from "./FriendsButtons";

type Props ={
	id: string,
}

function Friends(props:Props) {
	const  [ title, setTitle ] = useState('Friends');
	const [value, setValue] = useState('');
	const { state, dispatch } = useContext(AuthContext);

	const isCurrent = props.id === state.user.id;
	const inputChange = (e:React.ChangeEvent<HTMLInputElement>) =>
	{
		setValue(e.target.value);
	}
	return (
		<div className="info-card game-history">
			<header>
				<h1>{title}</h1>
			</header>
			{ title !== 'Blocked Users' && <div className='search-bar'>
				<AiOutlineSearch />
				<input type='text' placeholder="Search..." autoFocus value={value} onChange={inputChange}/>
			</div> }
			{!isCurrent || title === 'Friends' ? <StatsFriends id={props.id}/> : title === 'Blocked Users' ? <BlockedUsers /> : <AddFriends value={value} />}
			<FriendsButtons setTitle={setTitle} isCurrent={isCurrent}/>
		</div>
	);
}

export default Friends;
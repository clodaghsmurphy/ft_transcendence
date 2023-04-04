import React from 'react';
import { VscAdd } from "react-icons/vsc";
import { FaUserFriends } from "react-icons/fa";
import { BiMessageAltError } from "react-icons/bi";
import { useState, useContext } from 'react';

type Props ={
     setTitle: (value:string) => void,
     isCurrent: boolean
}

function FriendsButtons(props:Props) {
    return (
        <footer className='friends-option-bar'>
				<button className='friends-toggle-button' onClick={() => props.setTitle('Friends')}>
					<FaUserFriends />
				</button>
                { props.isCurrent &&
                <>
				<button className='friends-toggle-button' onClick={() => props.setTitle('Blocked Users')}>
					<BiMessageAltError />
				</button>
				<button className='friends-toggle-button' onClick={() => props.setTitle('Add Friends')}>
					<VscAdd />
				</button>
                </>
                    }
              
		</footer>
    )
}

export default FriendsButtons;
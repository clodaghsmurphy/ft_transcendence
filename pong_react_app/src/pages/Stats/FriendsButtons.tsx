import React from 'react';
import { TbUserSearch } from "react-icons/tb";
import { FaUserFriends } from "react-icons/fa";
import { BiMessageAltError } from "react-icons/bi";

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
					<TbUserSearch />
				</button>
                </>
                    }
              
		</footer>
    )
}

export default FriendsButtons;
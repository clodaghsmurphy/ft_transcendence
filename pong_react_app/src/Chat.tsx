import React from 'react'
import NavBar from './NavBar'
import './Dashboard.css'
import './Chat.css'

function Chat()
{
    return (
        <div className="dashboard">
        <NavBar /> 
        <main className="page-wrapper">
            <div className="channels">
				<h1>
					<div className="delimiters"></div>
					<div className='channels_title'>Message</div>
					<div className="delimiters"></div>
				</h1>
			</div>
            <div className="chatbox"></div>
            <div className="group-members"></div>
        </main>
        </div>
    );
}

export default Chat;
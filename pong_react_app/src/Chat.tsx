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
            <div className="messages"></div>
            <div className="chatbox"></div>
            <div className="group-members"></div>
        </main>
        </div>
    );
}

export default Chat;
import React from 'react'
import './Dashboard.css'
import logo from './media/pong-logo.svg'
import  user_pfp from './media/user.png'

import { Link } from 'react-router-dom'


function NavBar()
{
    return (
    <nav className="nav-bar">
        <div className="nav-logo">
            <img src={logo} />
        </div>
        <ul className="nav-list">
            <Link to="/main">Home</Link>
            <li>Stats</li>
            <Link to="/chat">Chat</Link>
            <li>Friends</li>
        </ul>
        <div className="nav-user" id="nav-user">
            <img src={user_pfp} className="user-pfp"/>
            <p className='userName'> Welcome clmurphy !</p>
        </div>
    </nav>
    );
}

export default NavBar;
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
            <Link to="/main" className='navlink'>Home</Link>
            <li className='navlink' >Stats</li>
            <Link to="/chat" className='navlink'>Chat</Link>
            <li className='navlink'>Friends</li>
        </ul>
        <div className="nav-user" id="nav-user">
            <div className="user-pfp">
                <img src={user_pfp} />
            </div>
            <p className='userName'> Welcome clmurphy !</p>
        </div>
    </nav>
    );
}

export default NavBar;
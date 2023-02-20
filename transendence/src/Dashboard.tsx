import React from 'react'
import './Dashboard.css'
import logo from './media/pong-logo.svg'
import  user_pfp from './media/user.png'

function Dashboard()
{
    return (
        <div className="dashboard">
        <nav className="nav-bar">
            <div className="nav-logo">
                <img src={logo} />
            </div>
            <ul className="nav-list">
                <li>Home</li>
                <li>Stats</li>
                <li>Friends</li>
            </ul>
            <div className="nav-user" id="nav-user">
                <img src={user_pfp} className="user-pfp"/>
                <p className='userName'> CLMURPHY</p>
            </div>
        </nav>
    </div>
    );
}

export default Dashboard;
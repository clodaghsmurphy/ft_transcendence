import React from 'react'
import logo from './media/pong-logo.svg'
import  user-pfp from './media/user.png'

function Dashboard()
{
    return (
        <div className="dashboard">
        <nav className="nav-bar">
            <img src="./media/pong-logo.svg" className="nav-logo"/>
            <ul className="nav-list">
                <li>Home</li>
                <li>Stats</li>
                <li>Friends</li>
            </ul>
            <div className="nav-user" id="nav-user">
            <img src="./media/user.png" className="user-pfp"/>
            </div>
        </nav>
    </div>
    );
}

export default Dashboard;
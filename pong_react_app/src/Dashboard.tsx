import React from 'react'
import NavBar from './NavBar'
import Main from './Main'
import Chat from './Chat'
import './Dashboard.css'

function Dashboard()
{
    return (
        <div className="dashboard">
        <NavBar />       
        <Main />
        </div>
    );
}

export default Dashboard;

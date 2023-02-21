import React from 'react'
import NavBar from './NavBar'
import './Dashboard.css'

function Main()
{
    return (
        <div className="dashboard">
        <NavBar /> 
       <main className="page-wrapper">
            <div className="game">
                <div className="game-screen"></div>
                <div className="player-vs"></div>
            </div>
            <div className="live-chat"></div>
        </main>
        </div>
    );
}

export default Main;
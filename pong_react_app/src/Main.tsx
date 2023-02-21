import React from 'react'
import NavBar from './NavBar'
import MainChat from './MainChat'
import './Dashboard.css'
import  user_pfp from './media/user.png'

function Main()
{
    return (
        <div className="dashboard">
        <NavBar /> 
       <main className="page-wrapper">
            <div className="game">
                <div className="game-screen"></div>
                <div className="player-vs">
                    <div className="player">
                        <div className="avatar">
                            <img src={user_pfp} />
                        </div>
                        <div className="player-info">
                            <span className="player-name">clmurphy</span>
                            <span className="player-level">LVL 12</span>
                        </div>
                    </div>
                    <div className="VS">VS</div>
                    <div className="player">
                        <div className="avatar">
                            <img src={user_pfp} />
                        </div>
                        <div className="player-info">
                            <span className="player-name">nguiard</span>
                            <span className="player-level">LVL 12</span>
                        </div>
                    </div>
                </div>
            </div>
            <MainChat />
        </main>
        </div>
    );
}

export default Main;
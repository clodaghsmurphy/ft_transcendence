import React from 'react'
import NavBar from './NavBar'
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
            <div className="live-chat">
                <div className="chat-title">
                    <h1>Live Chat Room </h1>
                </div>
                <div className="chat-box">
                    <div className="message">
                        <div className="message-header">
                            <span>clmurphy</span>
                            <span>1m</span>
                        </div>
                    </div>
                    <div className="message"></div>
                </div>
            </div>
        </main>
        </div>
    );
}

export default Main;
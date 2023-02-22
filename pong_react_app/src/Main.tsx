import React from 'react'
import NavBar from './NavBar'
import MainChat from './MainChat'
import './Dashboard.css'
import ball from './media/Ball.svg';
import paddle from './media/Paddle.svg'
import  user_pfp from './media/user.png'
import  nathan from './media/nguiard.jpg'

function Main()
{
    return (
        <div className='body '>
            <div className="app">
            <NavBar /> 
        <main className="page-wrapper">
                <div className="game">
                    <div className="game-screen">
                        <button className="game-button">PLAY</button>
                        <div className="paddle" id="paddle1">
                            <img src={paddle} />
                        </div>
                        <div className="paddle" id="paddle2">
                            <img src={paddle} />
                        </div>
                        <div className="ball">
                            <img src={ball} />;
				        </div>
                    </div>
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
                        <div className="score">0 - 0</div>
                        <div className="player">
                            <div className="avatar">
                                <img src={nathan} />
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
        </div>
    );
}

export default Main;
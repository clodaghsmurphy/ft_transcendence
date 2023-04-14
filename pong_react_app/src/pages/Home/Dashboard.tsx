import React, { useEffect, useState } from 'react'
import NavBar from '../Components/NavBar'
import ball from '../../media/Ball.svg';
import paddle from '../../media/Paddle.svg';
import nathan from '../../media/nguiard.jpg';
import './Dashboard.css'
import { useContext } from 'react';
import { AuthContext } from '../../App';
import CreateGame from './CreateGame';
import { io, Socket } from 'socket.io-client';
import axios, { AxiosResponse, AxiosStatic } from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import '../Chat/ToastifyFix.css'
import Game from '../Game/Game';

const params = new URLSearchParams(window.location.search)
const param_id = params.get("id")
let socket_game: Socket

export type GameType = {
	id: number,
	ongoing: boolean,
	player1: number,
	player1_goals: number | null,
	player2: number,
	player2_goals: number | null,
	winner: number | null
}

function Dashboard()
{
    const { state,  dispatch } = useContext(AuthContext);
	let [in_game, set_in_game] = useState(false)
	let [is_created, set_is_created] = useState(false)
	let [game_data, set_game_data] = useState({} as GameType)

	useEffect(() => {
		document.title = 'Home'

		socket_game = io(`http://${window.location.hostname}:8080/game`,
		{
			extraHeaders: {
				Authorization: "Bearer " + localStorage.getItem('token')
			}
		});

		if (param_id) {
			axios.get('/api/game/' + param_id)
				.then((response: AxiosResponse) => {
					set_is_created(true)
					toast.success('Game created')
					set_game_data(response.data as GameType)
					set_in_game(true)
				})
		}

	}, [])

    return (
        <div className="dashboard">
            <div className='body '>
            <div className="app">
            <NavBar />
			<ToastContainer theme='dark'/>
        <main className="page-wrapper">
                <div className="game">
                    {in_game ? <Game /> :
						<div className="game-screen">
                        <button className="game-button">PLAY</button>
                        <div className="paddle" id="paddle1">
                            <img src={paddle} alt="paddle"/>
                        </div>
                        <div className="paddle" id="paddle2">
                            <img src={paddle} alt="paddle"/>
                        </div>
                        <div className="ball">
                            <img src={ball} alt="ball"/>;
				        </div>
                    </div>}
                    <div className="player-vs">
                        <div className="player">
                            <div className="avatar">
                                <img src={state.user.avatar} />
                            </div>
                            <div className="player-info">
                                <span className="player-name">{state.user.name}</span>
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
                <CreateGame />
            </main>
            </div>
        </div>
        </div>
    );
}

export default Dashboard;

import React, { useState, useContext, useEffect } from "react";
import gameAvatar from './media/nguiard.jpg';
import { TbUserSearch } from "react-icons/tb";
import User, { User_last_game, id_to_user } from "../utils/User";
import Image from "../Components/Image";
import { AuthContext } from "../../App";
import { user } from "../../store/reducer";
import axios, { AxiosResponse, AxiosError} from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import '../Chat/ToastifyFix.css'


const { v4: uuidv4 } = require('uuid');

type GameHistory = {
	opponent: user, // game oppenent
	opponent_score: number,
	score: number,
	win: boolean,
	rating_change: number,
}

// const GameHistoryDefault : GameHistory[] = 
// 	[{
// 	opponent :  { name:'nguiard', id: '94596', avatar: 'test', otp_enabled:false},
// 	opponent_score : 3,
// 	score : 4,
// 	win : true,
// 	rating_change: 0
// 	},
// 	{
// 		opponent :  { name:'nguiard', id: '94596', avatar: 'test', otp_enabled:false},
// 		opponent_score : 3,
// 		rating_change: 0,
// 		score : 2,
// 		win : false,
// 		},
// 	]


type Props = {
	id: number
}

function GameHistory(props: Props)
{
    const { state,  dispatch } = useContext(AuthContext);
	const [ gameHistory, setGameHistory] = useState<GameHistory[]>([]);
	const [ ratingClass, setRatingClass] = useState("");

	useEffect(() => {
		getGameHistory();
	}, [])

	const getGameHistory = async () => {
		try {
			const result = await axios.get(`/api/user/info/${props.id}/games`)
			setGameHistory(result.data);
			setRatingClass(result.data.rating_change > 0  ? 'rating_up' : 'rating_down' )
		} catch (error) {
			toast.error(`Game History error : ${error}`)
		}
	}

	return (
	
		<div className="info-body">
				{ gameHistory.map(game => 
			<div className={game.win ? "info-item win" : "info-item lose"} key={uuidv4()}>
				<div className="stats-avatar">
					<Image id={parseInt(game.opponent.id)} status={0}/>
				</div>
				<span className="game-username">{game.opponent.name}</span>
				<div className="game-score" >{`${game.score} - ${game.opponent_score}`}</div>
				{ game.rating_change > 0 ? <div className='rating_up'>{`+ ${game.rating_change}`}</div> :
				 <div className='rating_down'>{` ${game.rating_change}`}</div>}
			</div>
			)}
		</div>
		
	);
}

export default GameHistory;
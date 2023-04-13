import React, { useState, useContext } from "react";
import gameAvatar from './media/nguiard.jpg';
import { TbUserSearch } from "react-icons/tb";
import User, { User_last_game, id_to_user } from "../utils/User";
import Image from "../Components/Image";
import { AuthContext } from "../../App";
import { user } from "../../store/reducer";
const { v4: uuidv4 } = require('uuid');

type GameHistory = {
	opp: user, // game oppenent
	opp_score: number,
	my_score: number,
	win: boolean
}

const GameHistoryDefault : GameHistory[] = 
	[{
	opp :  { name:'nguiard', id: '94596', avatar: 'test', otp_enabled:false},
	opp_score : 3,
	my_score : 4,
	win : true,
	},
	{
		opp :  { name:'nguiard', id: '94596', avatar: 'test', otp_enabled:false},
		opp_score : 3,
		my_score : 2,
		win : false,
		},
	]


type Props = {
	id: number
}

function GameHistory(props: Props)
{
    const { state,  dispatch } = useContext(AuthContext);

	
	const [ gameHistory, setGameHistory] = useState<GameHistory[]>(GameHistoryDefault);

	return (
	
		<div className="info-body">
				{ gameHistory.map(game => 
			<div className={game.win ? "info-item win" : "info-item lose"} key={uuidv4()}>
				<div className="stats-avatar">
					<Image id={parseInt(game.opp.id)} status={0}/>
				</div>
				<span className="game-username">{game.opp.name}</span>
				<div className="game-score" >{`${game.my_score} - ${game.opp_score}`}</div>
			</div>
			)}
		</div>
		
	);
}

export default GameHistory;
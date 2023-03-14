import React, { useState } from "react";
import gameAvatar from './media/nguiard.jpg';
import { TbUserSearch } from "react-icons/tb";
import User, { User_last_game, id_to_user } from "./User";
const { v4: uuidv4 } = require('uuid');


function OneGame(game: User_last_game, current_user: User, every_user: User[]): JSX.Element {

	let opp = typeof game.opponnent === "number" ?
			id_to_user(every_user, game.opponnent) : game.opponnent;
	let score = game.score;
	let len = score.length.toString();
	let color = game.has_won ? "#00c000" : "#d00000"

	return (
		<div className="info-item" key={uuidv4()}>
				<div className="stats-avatar">
					<img src={opp.avatar}/>
				</div>
				<span className="game-username">{opp.name}</span>
				<div className="game-score" style={{
					width: "calc(" + len + " * 1.3rem)",
					color: color,
				}}>{score}</div>
			</div>
	)
}

function GameHistory(every_user: User[], current_user: User)
{
	let [Games, setGames] = useState([] as JSX.Element[]);

	if (typeof every_user[0] === 'undefined' || typeof current_user.name === 'undefined')
		return <div key={uuidv4()} className='info-body'/>

	for (const game of current_user.last_games) {
		let tmp = Games;
		tmp.push(OneGame(game, current_user, every_user));
		setGames(tmp);
	}

	return (
		<div className="info-body">
			{Games}
		</div>
	);
}

export default GameHistory;
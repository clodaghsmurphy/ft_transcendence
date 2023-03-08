import React from "react";
import gameAvatar from './media/nguiard.jpg';
import { TbUserSearch } from "react-icons/tb";

function GameHistory()
{
	let has_won = false;
	let score = "0 - 2";
	let len = score.length.toString();
	let color = has_won ? "#00c000" : "#d00000"
	return (
		<div className="info-body">
			<div className="info-item">
				<div className="stats-avatar">
					<img src={gameAvatar} />
				</div>
				<span className="game-username">nguiard</span>
				<div className="game-score" style={{
					width: "calc(" + len + " * 1.3rem)",
					color: color,
				}}>{score}</div>
			</div>
		</div>
	);
}

export default GameHistory;
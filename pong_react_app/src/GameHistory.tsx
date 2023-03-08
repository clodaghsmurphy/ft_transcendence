import React from "react";
import gameAvatar from './media/nguiard.jpg';
import { TbUserSearch } from "react-icons/tb";

function GameHistory()
{
	return (
		<div className="info-body">
			<div className="info-item">
				<div className="stats-avatar">
					<img src={gameAvatar} />
				</div>
				<span className="game-username">nguiard</span>
				<div className="game-score">0 - 2</div>
			</div>
		</div>
	);
}

export default GameHistory;
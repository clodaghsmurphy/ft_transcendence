import React from "react";

function ProfileStats() {
	return (
		<ul className="profile-game-stats">
			<li>
				<span style={{
					color: "#7070a5",
					fontSize: '.8em'
				}} >Total games</span>
				<span>13</span>
			</li>
			<li>
				<span style={{
					color: "#7070a5",
					fontSize: '.8em'
				}}>Wins</span>
				<span>85%</span>
			</li>
			<li>
				<span style={{
					color: "#7070a5",
					fontSize: '.8em'
				}}>Loss</span>
				<span>15%</span>
			</li>
			<li>
				<span style={{
					color: "#7070a5",
					fontSize: '.8em'
				}}>Lvl</span>
				<span>1</span>
			</li>
		</ul>
	)
}

export default ProfileStats;
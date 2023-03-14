import React, { useState } from "react";
import gameAvatar from './media/nguiard.jpg';
import { TbUserSearch } from "react-icons/tb";
import Winner from './media/ach_icons/Winner.png'
import Addicted from './media/ach_icons/Addicted.png'
import Blah_blah from './media/ach_icons/Blah_blah.png'
import Bully from './media/ach_icons/Bully.png'
import Collector from './media/ach_icons/Collector.png'
import Community from './media/ach_icons/Community.png'
import First_Steps from './media/ach_icons/First_Steps.png'
import For_life from './media/ach_icons/For_life.png'
import Master from './media/ach_icons/Master.png'
import Newbie from './media/ach_icons/Newbie.png'
import OldFashioned from './media/ach_icons/Old-Fashioned.png'
import On_Fire from './media/ach_icons/On_Fire.png'
import Player from './media/ach_icons/Player.png'
import Serial_Streaker from './media/ach_icons/Serial_Streaker.png'
import Sharp_Shooter from './media/ach_icons/Sharp_Shooter.png'
import Striker from './media/ach_icons/Striker.png'
import Surpass_the_Masters from './media/ach_icons/Surpass_the_Masters.png'
import Who_can_stop_you from './media/ach_icons/Who_can_stop_you.png'
import Zoomer from './media/ach_icons/Zoomer.png'
import Legend from './media/ach_icons/Legend.png'
import User from "./User";

const { v4: uuidv4 } = require('uuid');


type Achievement = {
	icon: string,		// Icon of the achievement
	title: string,		// Title of the achievement
	descripton: string,	// Description of the achievement
	id: number,			// Id of the achievement
	cap: number,		// Number of things to chieve the achievement
						// exemple: Win 10 games -> cap = 10
}

type UserAchievement = {
	achievement: number,	// The achievement id
	completed: boolean,		// if counter == achievement.cap
	counter: number,		// Number of things done (see Achievement.cap)
}

export function every_achievements(): Achievement[] {
	return ([
		{
			icon: Newbie,
			title: 'Newbie',
			descripton: 'Play 5 games',
			id: 1,
			cap: 5,
		},
		{
			icon: Player,
			title: 'Player',
			descripton: 'Play 25 games',
			id: 2,
			cap: 25,
		},
		{
			icon: Addicted,
			title: 'Addicted',
			descripton: 'Play 200 games',
			id: 3,
			cap: 200,
		},
		{
			icon: Winner,
			title: 'Winner',
			descripton: 'Win 5 games',
			id: 4,
			cap: 5,
		},
		{
			icon: Master,
			title: 'Master',
			descripton: 'Win 15 games',
			id: 5,
			cap: 15,
		},
		{
			icon: Legend,
			title: 'Legend',
			descripton: 'Win 50 games',
			id: 6,
			cap: 50,
		},
		{
			icon: OldFashioned,
			title: 'Old-Fashioned',
			descripton: 'Play 5 normal games',
			id: 7,
			cap: 5,
		},
		{
			icon: Zoomer,
			title: 'Zoomer',
			descripton: 'Play 5 custom games',
			id: 8,
			cap: 5,
		},
		{
			icon: On_Fire,
			title: 'On Fire',
			descripton: 'Win 3 games in a row',
			id: 9,
			cap: 3,
		},
		{
			icon: Serial_Streaker,
			title: 'Serial Streaker',
			descripton: 'Win 5 games in a row',
			id: 10,
			cap: 5,
		},
		{
			icon: Who_can_stop_you,
			title: 'Who can stop you?',
			descripton: 'Win 10 games in a row',
			id: 11,
			cap: 10,
		},
		{
			icon: First_Steps,
			title: 'First steps',
			descripton: 'Score 10 points',
			id: 12,
			cap: 10,
		},
		{
			icon: Sharp_Shooter,
			title: 'Sharp Shooter',
			descripton: 'Score 50 points',
			id: 13,
			cap: 50,
		},
		{
			icon: Collector,
			title: 'Collector',
			descripton: 'Score 500 points',
			id: 14,
			cap: 500,
		},
		{
			icon: Surpass_the_Masters,
			title: 'Surpass the masters',
			descripton: 'Beat every website creators',
			id: 15,
			cap: 4,
		},
		{
			icon: For_life,
			title: 'For life',
			descripton: 'Add a friend',
			id: 16,
			cap: 1,
		},
		{
			icon: Community,
			title: 'Community',
			descripton: 'Create a group chat',
			id: 17,
			cap: 1,
		},
		{
			icon: Blah_blah,
			title: 'Blah blah',
			descripton: 'Send 50 messages',
			id: 18,
			cap: 50,
		},
		{
			icon: Bully,
			title: 'Bully',
			descripton: 'Go on a 5 win streak against the same player',
			id: 19,
			cap: 5,
		},
		{
			icon: Striker,
			title: 'Striker',
			descripton: 'Block a website creator',
			id: 20,
			cap: 1,
		},
	])
}

export function id_to_achievement(id: number): Achievement {
	return (every_achievements().filter(ach => ach.id == id)[0]);
}

function AchievementShower(id: number, current_user: User): JSX.Element {
	let curr = id_to_achievement(id);
	let score = '0' + " / " + curr.cap
	let size = score.length.toString();

	return (
		<div className="info-item" key={uuidv4()}
			style={{
				minHeight: '75px',
			}}>
			<div className="stats-avatar">
				<img src={curr.icon}/>
			</div>
			<div className='achievement-container'>
				<div className="achievement-title">{curr.title}</div>
				<div className="achievement-info">
					<div>{curr.descripton}</div>
					<div style={{
						width: "calc(" + size + " * 0.75rem)"
					}}>{score}</div>
				</div>
			</div>
		</div>
	)
}

function StatsAchievements(current_user: User) {
	let every = every_achievements();
	let [AchBlocks, SetAchBlocks] = useState([] as JSX.Element[]);

	for (const ach of every) {
		let tmp = AchBlocks;
		tmp.push(AchievementShower(ach.id, current_user))
		// SetAchBlocks(tmp);
	}
	return (
		<div className="info-body">
			{AchBlocks}
		</div>
	);
}

export default StatsAchievements;
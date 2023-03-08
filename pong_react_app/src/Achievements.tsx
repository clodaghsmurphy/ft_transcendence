import React from "react";
import gameAvatar from './media/nguiard.jpg';
import { TbUserSearch } from "react-icons/tb";
import cup from './media/cup.png'

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
			icon: cup,
			title: 'Newbie',
			descripton: 'Play 5 games',
			id: 1,
			cap: 5,
		},
		{
			icon: cup,
			title: 'Player',
			descripton: 'Play 25 games',
			id: 2,
			cap: 25,
		},
		{
			icon: cup,
			title: 'Addicted',
			descripton: 'Play 200 games',
			id: 3,
			cap: 200,
		},
		{
			icon: cup,
			title: 'Winner',
			descripton: 'Win 5 games',
			id: 4,
			cap: 5,
		},
		{
			icon: cup,
			title: 'Master',
			descripton: 'Win 15 games',
			id: 5,
			cap: 15,
		},
		{
			icon: cup,
			title: 'Legend',
			descripton: 'Win 50 games',
			id: 6,
			cap: 50,
		},
		{
			icon: cup,
			title: 'Old-Fashioned',
			descripton: 'Play 5 normal games',
			id: 7,
			cap: 5,
		},
		{
			icon: cup,
			title: 'Zoomer',
			descripton: 'Play 5 custom games',
			id: 8,
			cap: 5,
		},
		{
			icon: cup,
			title: 'On Fire',
			descripton: 'Win 3 games in a row',
			id: 9,
			cap: 3,
		},
		{
			icon: cup,
			title: 'Serial Streaker',
			descripton: 'Win 5 games in a row',
			id: 10,
			cap: 5,
		},
		{
			icon: cup,
			title: 'Who can stop him?',
			descripton: 'Win 10 games in a row',
			id: 11,
			cap: 10,
		},
		{
			icon: cup,
			title: 'First steps',
			descripton: 'Score 10 points',
			id: 12,
			cap: 10,
		},
		{
			icon: cup,
			title: 'Sharp Shots',
			descripton: 'Score 50 points',
			id: 13,
			cap: 50,
		},
		{
			icon: cup,
			title: 'Collector',
			descripton: 'Score 500 points',
			id: 14,
			cap: 500,
		},
		{
			icon: cup,
			title: 'Surpass the masters',
			descripton: 'Beat every website creators',
			id: 15,
			cap: 4,
		},
		{
			icon: cup,
			title: 'For the rest of my life',
			descripton: 'Add a friend',
			id: 16,
			cap: 1,
		},
		{
			icon: cup,
			title: 'Community',
			descripton: 'Create a group chat',
			id: 17,
			cap: 1,
		},
		{
			icon: cup,
			title: 'Bla-bla',
			descripton: 'Send 50 messages',
			id: 18,
			cap: 50,
		},
		{
			icon: cup,
			title: 'Bully',
			descripton: 'Go on a 5 win streak against the same player',
			id: 19,
			cap: 5,
		},
		{
			icon: cup,
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


function StatsAchievements() {
	return (
		<div className="info-body">
		</div>
	);
}

export default StatsAchievements;
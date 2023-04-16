import { Stats } from "@prisma/client";

export type AchievementChecker =
	(cap: number, stat: Stats) => [boolean, number];

export type Achievement = {
	icon: string,
	title: string,
	description: string,
	id: number,
	cap: number,
	score: number,
	    checker: AchievementChecker
};

const checkPoint: AchievementChecker =
	(cap: number, stat: Stats) => {
		if (stat.points >= cap) {
			return [true, cap];
		}
		return [false, stat.points];
};

const checkWin: AchievementChecker =
	(cap: number, stat: Stats) => {
		if (stat.wins >= cap) {
			return [true, cap];
		}
		return [false, stat.wins];
};

const checkWinstreak: AchievementChecker =
	(cap: number, stat: Stats) => {
		if (stat.max_streak >= cap) {
			return [true, cap];
		}
		return [false, stat.max_streak];
};

const checkPlayed: AchievementChecker =
	(cap: number, stat: Stats) => {
		if (stat.total_games >= cap) {
			return [true, cap];
		}
		return [false, stat.total_games];
};


export const DefaultAchievements: Achievement[] = [
	   {
        icon: 'Newbie',
        title: 'Newbie',
        description: 'Play 5 games',
        id: 1,
        cap: 5,
        score: 0,
		checker: checkPlayed
    },
    {
        icon: 'Player',
        title: 'Player',
        description: 'Play 25 games',
        id: 2,
        cap: 25,
        score: 0,
		checker: checkPlayed
    },
    {
        icon: 'Addicted',
        title: 'Addicted',
        description: 'Play 200 games',
        id: 3,
        cap: 200,
        score: 0,
		checker: checkPlayed
    },
    {
        icon: 'Winner',
        title: 'Winner',
        description: 'Win 5 games',
        id: 4,
        cap: 5,
        score: 0,
		checker: checkWin
    },
    {
        icon: 'Master',
        title: 'Master',
        description: 'Win 15 games',
        id: 5,
        cap: 15,
        score: 0,
		checker: checkWin
    },
    {
        icon: 'Legend',
        title: 'Legend',
        description: 'Win 50 games',
        id: 6,
        cap: 50,
        score: 0,
		checker: checkWin
    },
    {
        icon: 'On_Fire',
        title: 'On Fire',
        description: 'Win 3 games in a row',
        id: 9,
        cap: 3,
        score: 0,
		checker: checkWinstreak
    },
    {
        icon: 'Serial_Streaker',
        title: 'Serial Streaker',
        description: 'Win 5 games in a row',
        id: 10,
        cap: 5,
        score: 0,
		checker: checkWinstreak
    },
    {
        icon: 'Who_can_stop_you',
        title: 'Who can stop you?',
        description: 'Win 10 games in a row',
        id: 11,
        cap: 10,
        score: 0,
		checker: checkWinstreak
    },
    {
        icon:'First_Steps',
        title: 'First steps',
        description: 'Score 10 points',
        id: 12,
        cap: 10,
        score: 0,
		checker: checkPoint
    },
    {
        icon: 'Sharp_Shooter',
        title: 'Sharp Shooter',
        description: 'Score 50 points',
        id: 13,
        cap: 50,
        score: 0,
		checker: checkPoint
    },
    {
        icon: 'Collector',
        title: 'Collector',
        description: 'Score 500 points',
        id: 14,
        cap: 500,
        score: 0,
		checker: checkPoint
    }
];

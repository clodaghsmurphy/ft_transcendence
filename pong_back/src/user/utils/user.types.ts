import Achievements from '@prisma/client'

export type AchievementsList = {
    icon: string,
    title: string,
    description: string,
    id: number,
    cap:number,
    score:number
}

export const DefaultAchievements: AchievementsList[] =[
    {
        icon: 'Newbie',
        title: 'Newbie',
        description: 'Play 5 games',
        id: 1,
        cap: 5,
        score: 0
    },
    {
        icon: 'Player',
        title: 'Player',
        description: 'Play 25 games',
        id: 2,
        cap: 25,
        score: 0
    },
    {
        icon: 'Addicted',
        title: 'Addicted',
        description: 'Play 200 games',
        id: 3,
        cap: 200,
        score: 0
    },
    {
        icon: 'Winner',
        title: 'Winner',
        description: 'Win 5 games',
        id: 4,
        cap: 5,
        score: 0
    },
    {
        icon: 'Master',
        title: 'Master',
        description: 'Win 15 games',
        id: 5,
        cap: 15,
        score: 0
    },
    {
        icon: 'Legend',
        title: 'Legend',
        description: 'Win 50 games',
        id: 6,
        cap: 50,
        score: 0
    },
    {
        icon: 'OldFashioned',
        title: 'Old-Fashioned',
        description: 'Play 5 normal games',
        id: 7,
        cap: 5,
        score: 0
    },
    {
        icon: 'Zoomer',
        title: 'Zoomer',
        description: 'Play 5 custom games',
        id: 8,
        cap: 5,
        score: 0
    },
    {
        icon: 'On_Fire',
        title: 'On Fire',
        description: 'Win 3 games in a row',
        id: 9,
        cap: 3,
        score: 0
    },
    {
        icon: 'Serial_Streaker',
        title: 'Serial Streaker',
        description: 'Win 5 games in a row',
        id: 10,
        cap: 5,
        score: 0
    },
    {
        icon: 'Who_can_stop_you',
        title: 'Who can stop you?',
        description: 'Win 10 games in a row',
        id: 11,
        cap: 10,
        score: 0
    },
    {
        icon:'First_Steps',
        title: 'First steps',
        description: 'Score 10 points',
        id: 12,
        cap: 10,
        score: 0
    },
    {
        icon: 'Sharp_Shooter',
        title: 'Sharp Shooter',
        description: 'Score 50 points',
        id: 13,
        cap: 50,
        score: 0
    },
    {
        icon: 'Collector',
        title: 'Collector',
        description: 'Score 500 points',
        id: 14,
        cap: 500,
        score: 0
    }
]
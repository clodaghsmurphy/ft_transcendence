import React from 'react'
import { Achievement } from './Achievements';
import { useEffect, useState} from 'react';
import axios from 'axios'


type Props = {
    ach: Achievement[],
    id: number
}
const { v4: uuidv4 } = require('uuid');

function AllAchievements(props: Props){
    const [ achievements, setAchievements] = useState<Achievement[]>([])

    useEffect(() => {
        getAchievements();
    }, [])

    const getAchievements = async () => {
        try {
            const result = await axios.post(`http://${window.location.hostname}:8080/api/achievements/achievements-list`, { id : props.id });
            setAchievements(result.data);
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <>
             {   achievements.map (ach =>
                        <div className="info-item" key={uuidv4()}
                        style={{
                            minHeight: '75px',
                        }}>
                            <div className="stats-avatar">
                                <img src={`http://${window.location.hostname}:8080/api/achievements/achievement-icon/${ach.icon}`} alt={`${ach.title} icon`}/>
                            </div>
                            <div className='achievement-container'>
                                <div className="achievement-title">{ach.title}</div>
                                <div className="achievement-info">
                                    <div className='ach-description'>{ach.description}</div>
                                    <div >{`${ach.score} / ${ach.cap}`}</div>
                                </div>
                            </div>
                        </div>
                    )}
        </>
    )
}

export default AllAchievements;

import React from 'react'
import { Achievement } from './Achievements'

type Props = {
    ach: Achievement[],
}

const { v4: uuidv4 } = require('uuid');

function AchievementList(props: Props) {
    if (props.ach.length === 0)
        return (
            <div>

            </div>
        )
    else{
        return (
            <>
                    {   props.ach.map (ach =>
                        <div className="info-item" key={uuidv4()}
                        style={{
                            minHeight: '75px',
                        }}>
                            <div className="stats-avatar">
                                <img src={ach.icon} alt={`${ach.title} icon`}/>
                            </div>
                            <div className='achievement-container'>
                                <div className="achievement-title">{ach.title}</div>
                                <div className="achievement-info">
                                    <div>{ach.descripton}</div>
                                    <div >{ach.score}</div>
                                </div>
                            </div>
                        </div>
                    )}
                
                </>
   
        ) 
                    }
}

export default AchievementList;
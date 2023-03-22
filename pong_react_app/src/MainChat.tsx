import React from 'react'
import './Dashboard.css'
import  Messages from './Messages'
import  user_pfp from './media/user.png'
import  nathan from './media/nguiard.jpg'
import { sample_channel_data } from './Channels'
import { sample_user_data } from './User'


function MainChat ()
{
    return (
        <div className="live-chat">
            <div className="chat-title">
            </div>
            <div className="chat-box">
                {/* {Messages(sample_channel_data()[0], sample_user_data(), sample_user_data()[1])} */}
            </div>
         
           
    </div>
    );
}

export default MainChat;
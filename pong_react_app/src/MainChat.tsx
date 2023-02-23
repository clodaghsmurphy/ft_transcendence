import React from 'react'
import './Dashboard.css'
import  Messages from './Messages'
import  user_pfp from './media/user.png'
import  nathan from './media/nguiard.jpg'


function MainChat ()
{
    return (
        <div className="live-chat">
            <div className="chat-title">
            </div>
            <div className="chat-box">
                < Messages />
            </div>
         
           
    </div>
    );
}

export default MainChat;
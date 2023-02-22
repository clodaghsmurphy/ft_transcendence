import React from 'react'
import './Dashboard.css'
import  user_pfp from './media/user.png'
import  nathan from './media/nguiard.jpg'


function MainChat ()
{
    return (
        <div className="live-chat">
            <div className="chat-title">
                <h1>Live Chat Room </h1>
            </div>
            <div className="chat-box">
                <div className="message-wrapper sender">
                    <div className="message-avatar">
                        <img src={user_pfp}/>
                    </div>
                    <div className="message">
                        <div className="message-header">
                            <span>clmurphy</span>
                        
                        </div>
                        <div className="message-body">
                            Hey how are you

                        </div>
                    </div>
                </div>
                <div className="message-wrapper-receiver">
                    <div className="message-avatar">
                        <img src={nathan}/>
                    </div>
                    <div className="message">
                        <div className="message-header">
                            <span>nguiard</span>                      
                        </div>
                        <div className="message-body">
                            Im fine thanks and you
                        </div>
                    </div>
                </div>
            </div>
            <div className="message-box">
                <input type="text" className="message-input" placeholder="Type message..." />
                <div className="button-submit">
                    <button >Send</button>
                </div>
            </div>
           
    </div>
    );
}

export default MainChat;
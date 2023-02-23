import React, { ChangeEvent } from 'react'
import './Dashboard.css'
import user_pfp from './media/user.png'
import nathan from './media/nguiard.jpg'
import { Avatar } from '@mui/material'
import { useState } from 'react'




function Messages()
{
	const [formValue, setFormValue] = useState("");

	interface Messages {
		createdAt: Date;
		PhotoUrl: string;
		text: string;
		uid: string;
		name: string;

	} 
	return(
		<div id="messages">
			<div className="message-wrapper sender">
				<div className="message-avatar">
					<Avatar src={user_pfp} alt={"nathan"}
						sx={{
							'width': '3em', 'height': 'auto',
							'aspectRatio': '1 / 1', 'paddingLeft': '0px',
							'paddingRight': '5px'
						}}>
					</Avatar>
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
					<Avatar src={nathan} alt={"nathan"}
						sx={{
							'width': '3em', 'height': 'auto',
							'aspectRatio': '1 / 1', 'paddingLeft': '0px',
							'paddingRight': '5px'
						}}>
					</Avatar>
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
			<div className="message-box">
				<input type="text" className="message-input" placeholder="Type message..." value={ formValue } onChange={(e: ChangeEvent<HTMLInputElement>) => setFormValue(e.target.value)}/>
				<div className="button-submit">
					<button type="submit" >Send</button>
				</div>
			</div>
		</div>
		
		
	);
}

export default Messages
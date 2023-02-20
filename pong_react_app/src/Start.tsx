import React from 'react'
import logo from './media/pong-logo.svg'

function Start()
{
	return(
		<div className="start-screen">
			<div className="img-wrapper">
				<img src={logo} className="pong-logo" />
			</div>
			<div className="start-text">
				Press any key to begin salue
			</div>
		</div>
	);
}

export default Start;
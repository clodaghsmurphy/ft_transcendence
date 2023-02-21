import React from 'react';
import { Link } from 'react-router-dom'

function Login ()
{
	return (
		<div className="login-box">
			<Link to ="/dashboard">
				<button id="42-login">
					Login via 42
				</button>
			</Link>
			<button id="guest-login">
				Login as guest
			</button>
		</div>
	);
}

export default Login;
import React from 'react';
import { Link } from 'react-router-dom'
import { useCallback, useState } from 'react';
import api_keys from './api_cred'

function Login ()
{
	interface OAuth2data
	{
		authorizeUrl:string;
		cleintID:string;
		redirectUri:string;
		scope:string;
	}


	const getAuth = () =>
	{
		console.log(api_keys.api_keys.secret);
	}
	return (
		<div className="login-box">
			<Link className="login-button" to="/dashboard">
				<button id="42-login" onClick={getAuth}>
					Login via 42
				</button >
			</Link>
			<button  className="login-button" id="guest-login">
				Login as guest
			</button>
		</div>
	);
}

export default Login;
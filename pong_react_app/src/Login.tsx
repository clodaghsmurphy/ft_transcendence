import React from 'react';
import axios from "axios";
import { randomBytes } from "crypto"
import { nanoid } from 'nanoid'
import { Link } from 'react-router-dom'
import { useCallback, useState } from 'react';
import api_keys from './api_cred'


function Login ()
{
	interface loginData
	{
		authorizeUrl:string;
		clientID:string;
		redirectUri:string;
		scope:string;
		state:string;
	}

		//redirect_uri=https%3A%2F%2F42-beta.vmontagn.fr%2Fauth%2F42%2Fcallback

	const handleLogin = () =>
	{
		const login:loginData = { 
			authorizeUrl: "https://api.intra.42.fr/oauth/authorize",
			clientID: api_keys.client_id,
			redirectUri: encodeURIComponent("http://localhost:8080/!!"),
			scope: 'public',
			state: nanoid(16)
		}
		console.log(api_keys.secret);
		console.log(encodeURIComponent("http://localhost:8080"));
		const url:string = `https://api.intra.42.fr/oauth/authorize?client_id=${login.clientID}&redirect_uri=${login.redirectUri}&scope=${login.scope}&state=${login.state}&response_type=code`
		console.log(url);
	}
	return (
		<div className="login-box">
			<Link className="login-button" to="/dashboard">
				<button id="42-login" onClick={handleLogin}>
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
import React from 'react';
import axios from "axios";
import { randomBytes } from "crypto"
import { nanoid } from 'nanoid'
import { Link } from 'react-router-dom'
import { useCallback, useState } from 'react';
import api_keys from './api_cred'
import ball from './media/Ball.svg';
import paddle from './media/Paddle.svg'


function Login ()
{
	const [authUrl, setAuthUrl] = useState<string>();
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
			redirectUri: encodeURIComponent("http://localhost:8080"),
			scope: 'public',
			state: nanoid(16)
		}
		console.log(api_keys.secret);
		console.log(encodeURIComponent("http://localhost:8080"));
		const authUrl:string = `https://api.intra.42.fr/oauth/authorize?client_id=${login.clientID}&redirect_uri=${login.redirectUri}&scope=${login.scope}&state=${login.state}&response_type=code`
		setAuthUrl(authUrl);

		window.location.href = authUrl
	}
	return (
		<body>
		<main >
			<div className="horizon">
				<div className="paddle" id="paddle1">
					<img src={paddle} />
				</div>
				<div className="paddle" id="paddle2">
					<img src={paddle} />
				</div>
				<div className="ball">
					<img src={ball} />;
				</div>
				<div className="login-box">
			<button className="login-button">
				<button id="42-login" >
					Login via 42
				</button >
			</button>
			<button  className="login-button" id="guest-login">
				Login as guest
			</button>
		</div>
			</div>
			<div className="horizon-divide"></div>
			<div className="floor"></div>

		</main>

	</body>
		
	);
}

export default Login;
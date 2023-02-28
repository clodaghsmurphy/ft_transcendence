import React from 'react';
import axios from "axios";
import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { randomBytes } from "crypto"
import { nanoid } from 'nanoid'
import { Link, Navigate } from 'react-router-dom'
import { useCallback, useState } from 'react';
import api_keys from './api_cred'
import ball from './media/Ball.svg';
import paddle from './media/Paddle.svg'
import { AuthContext } from './App';


export interface loginData
	{
		authorizeUrl:string;
		clientID:string;
		redirectUri:string;
		scope:string;
		state:string;
	}

function Login ()
{
	const [authUrl, setAuthUrl] = useState<string>();
	const { state,  dispatch } = useContext(AuthContext);
	const [ data, setData ] = useState<String, boolean>( {errorMessage: "", isLoading: false});

	useEffect(() => {
		const url = window.location.href;
		console.log(url);
		
		if (url.includes("?code"))
		{
			const newUrl = url.split("?code");
			window.history.pushState({}, "", newUrl[0]);
			setData({ ...data, isLoading: true });
			 const code = newUrl[1];
		}
	}, [state, dispatch, data] ); 
	
	console.log('in login');

	

	const handleLogin = () =>
	{
		const login:loginData = { 
			authorizeUrl: "https://api.intra.42.fr/oauth/authorize",
			clientID: api_keys.client_id,
			redirectUri: encodeURIComponent("http://localhost:8080/login/callback"),
			scope: 'public',
			state: nanoid(16)
		}
		setData({ ...data, errorMessage: " "})
		const authUrl:string = `https://api.intra.42.fr/oauth/authorize?client_id=${login.clientID}&redirect_uri=${login.redirectUri}&scope=${login.scope}&state=${login.state}&response_type=code`
		setAuthUrl(authUrl);

		window.location.href = authUrl
	}

	if (state.isLoggedIn)
	{
		<Navigate to="/dashboard" />;
	}

	return (
		<div>
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
			<div className="login-button">
				<button id="42-login" onClick={handleLogin}>
					Login via 42
				</button >
			</div>
			<button  className="login-button" id="guest-login" >
				Login as guest
			</button>
		</div>
			</div>
			<div className="horizon-divide"></div>
			<div className="floor"></div>

		</main>

	</div>
		
	);
};




export default Login;
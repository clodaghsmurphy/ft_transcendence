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
import { initialState, reducer, State, Action, ActionKind } from "./store/reducer"

export interface loginData
	{
		authorizeUrl:string;
		clientID:string;
		redirectUri:string;
		scope:string;
		state:string;
	}
type Data = {
	errorMessage:string;
	isLoading: boolean;
};

function Login ()
{
	const location = useLocation();
	const [authUrl, setAuthUrl] = useState<string>();
	const { state,  dispatch } = useContext(AuthContext);
	const [ data, setData ] = useState<Data>( {errorMessage: "", isLoading: false});

	useEffect(() => {
		const url = window.location.href;
		
		if (url.includes("?code"))
		{
			const code = new URLSearchParams(location.search).get('code');
			const ustate = new URLSearchParams(location.search).get('state');
			

			const requestToken = {
				grant_type:'authorization_code', 
				client_id:api_keys.client_id,
				client_secret:api_keys.secret,
				code:code,
				redirect_uri:'http://localhost:8080/login',
				state:ustate
			}
			console.dir(requestToken);
			axios.post("https://api.intra.42.fr/oauth/token", requestToken)
				.then(response => {
					const access_token:string = response.data.access_token;
					console.log('access token : ' + access_token);
					const res =  axios.get('https://api.intra.42.fr/v2/me',
					{
						headers : {
							'Authorization': `Bearer ${access_token}`
						}
					})
					.then(res => 
					{
						const userData ={
							name:res.data.login,
							avatar:res.data.image.link
						}
						dispatch(
							{
								type: ActionKind.Login,
								payload: { user :{login: res.data.login, id:res.data.id, avatar:res.data.image.link}, isLoggedIn: true}
							}
						)
						console.log('state logged = ' + state.isLoggedIn);
						axios.post('/api/user/create', userData);
						console.log(res.data);
						console.log(res.data.id);
						console.log(res.data.login);
						console.log(res.data.email);
						console.log(res.data.image.link);
					})
				})
				.catch(error =>{
					console.log('Error:', error);
				})
		}
		
	}, [state, dispatch, data] ); 
	

	const handleLogin = () =>
	{
		const login:loginData = { 
			authorizeUrl: "https://api.intra.42.fr/oauth/authorize",
			clientID: api_keys.client_id,
			redirectUri: encodeURIComponent("http://localhost:8080/login"),
			scope: 'public',
			state: nanoid(16)
		}
		const authUrl:string = `https://api.intra.42.fr/oauth/authorize?client_id=${login.clientID}&redirect_uri=${login.redirectUri}&scope=${login.scope}&state=${login.state}&response_type=code`
		setAuthUrl(authUrl);
		window.location.href = authUrl;
		setData({ ...data, errorMessage: " "})

		
	}

	if (state.isLoggedIn)
	{
		return <Navigate to="/dashboard" />;
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
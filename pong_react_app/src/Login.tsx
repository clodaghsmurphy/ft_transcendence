import React from 'react';
import axios from "axios";
import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { randomBytes } from "crypto"
import { nanoid } from 'nanoid'
import { Link, Navigate } from 'react-router-dom'
import { useCallback, useState } from 'react';
import api_keys from './api_keys'
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


	async function getPayload () 
	{
		const { data } = await axios.get('http://localhost:3042/auth/profile');
		console.log('data is')
		console.log(data);
			console.log(data.name);
			dispatch(
				{
					type: ActionKind.Login,
					payload: { user:{ name:data.name, id:data.id, avatar:data.avatar, otp_enabled:data.otp_enabled}, isLoggedIn: true}
				}
			)
			localStorage.setItem("isLoggedIn", 'true');
			
			console.log(localStorage.getItem('user'));
			console.log(localStorage.getItem("isLoggedIn"));
	}
	
	useEffect( () => {
		const url = window.location.href;
		
		if (url.includes("?access_token"))
		{
			const token = new URLSearchParams(location.search).get('access_token')!;
			localStorage.setItem("token", token);
			axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
			getPayload();
		}
		
	}, [state, dispatch, data] ); 
	

	const handleLogin = async () =>
	{
		window.location.href = 'http://localhost:3042/auth/42/login';
		setData({ ...data, errorMessage: " "});
		
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
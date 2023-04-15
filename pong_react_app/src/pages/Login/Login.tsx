import React from 'react';
import axios from "axios";
import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import {  Navigate } from 'react-router-dom'
import {  useState } from 'react';
import ball from '../../media/Ball.svg';
import paddle from '../../media/Paddle.svg'
import { AuthContext } from '../../App';
import {  ActionKind } from "../../store/reducer"

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
	const { state,  dispatch } = useContext(AuthContext);
	const [ data, setData ] = useState<Data>( {errorMessage: "", isLoading: false});


	async function getPayload () 
	{
		try {
			const { data } = await axios.get(`http://${window.location.hostname}:8080/api/auth/profile`);
				dispatch(
					{
						type: ActionKind.Login,
						payload: { user:{ name:data.name, id:data.id, avatar:`http://${window.location.hostname}:8080/api/user/image/${data.id}`, otp_enabled:data.otp_enabled}, isLoggedIn: true}
					}
				)
				localStorage.setItem("isLoggedIn", 'true');
		}
		catch(e) {
			console.log(e);
		}
			
	}
	
	useEffect(() => {
		document.title = 'Login'
	})

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
		window.location.href = `http://${window.location.hostname}:8080/api/auth/42/login`;
		setData({ ...data, errorMessage: " "});	
	}

	if (state.isLoggedIn)
	{
		return <Navigate to="/game" />;
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
			<div className="login-button" onClick={handleLogin}>
				<button id="42-login" >
					Login via 42
				</button >
			</div>
		</div>
			</div>
			<div className="horizon-divide"></div>
			<div className="floor"></div>

		</main>

	</div>
		
	);
};




export default Login;
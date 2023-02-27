import React from 'react';
import axios from "axios";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { randomBytes } from "crypto"
import { nanoid } from 'nanoid'
import { Link } from 'react-router-dom'
import { useCallback, useState } from 'react';
import api_keys from './api_cred'

function CallBack () 
{
	const location = useLocation();
	console.log('here');
	interface requestToken
	{
		grant_type:string
		authorizeUrl:string;
		client_id:string;
		client_secret:string,
		code:string,
		redirect_uri:string;
		state:string;
	}


	useEffect(() =>
	{
		
		const code = new URLSearchParams(location.search).get('code');
		const state = new URLSearchParams(location.search).get('state');
		
		const requestToken = {
			grant_type:'authorization_code', 
			client_id:api_keys.client_id,
			client_secret:api_keys.secret,
			code:code,
			redirect_uri:'http://localhost:8080/login/callback',
			state:state
		}
        console.dir(requestToken);
		axios.post("https://api.intra.42.fr/oauth/token", requestToken)
			.then(response => {
				console.log('Response :', response.data);
			})
			.catch(error =>{
				console.log('Error:', error);
			})
	}, [location.search]);

		return (
			<div>
				<span>redirecting...</span>
			</div>
		);

};

export default CallBack;
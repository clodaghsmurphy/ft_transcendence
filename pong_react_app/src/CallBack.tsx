import React from 'react';
import axios from "axios";
import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { randomBytes } from "crypto"
import { nanoid } from 'nanoid'
import { Link, useNavigate } from 'react-router-dom'
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
		client_id:string | undefined;
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
	}, [location.search]);

		return (
			<div>
				<span>redirecting...</span>
			</div>
		);

};

export default CallBack;
import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom'
import axios from "axios";
import { AxiosResponse, AxiosError } from 'axios';
import { AuthContext } from './App';
import {  Navigate } from 'react-router-dom'
import { ActionKind } from "./store/reducer"


function LoginTfa()
{
    const [value, setValue] = useState('');
    const [ token, setToken] = useState('');
    const location = useLocation();
    const [error, setError ] = useState('');

	const { state,  dispatch } = useContext(AuthContext);

    async function getPayload () 
	{
        console.log('here')
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
            console.log(state);
			localStorage.setItem("isLoggedIn", 'true');
			console.log(localStorage.getItem("isLoggedIn"));
			console.log(localStorage.getItem("user"));
	}

    useEffect(() => {
        const url = window.location.href;
		
		if (url.includes("?access_token"))
		{
			setToken(new URLSearchParams(location.search).get('access_token')!);
            
        }
        // else
        //     window.location.href = 'http://localhost:8080/login';
    }, [])

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();
        console.log('in handle submit');
      
            axios.post('http://localhost:3042/auth/auth2fa',
                 { value },
                { headers: {"Authorization" : `Bearer ${token}`} }, 
            )
            .then(function(response:AxiosResponse) {
                setToken(response.data.access_token);
                localStorage.setItem("token", token);
			    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                getPayload();

            })
            .catch(function (error:AxiosError) {
                
                if( error.request.status  == 401)
                    setError('Incorrect authentication code');
                       
            });   
     }

     if (state.isLoggedIn)
     {
         return <Navigate to="/dashboard" />;
     }
    return (
        <div>
            <div>Please enter 2fa code</div>
            <form onSubmit={handleSubmit}>
                {error ? <div>Incorrect password</div> : null}
                <input type="text" value={value} onChange={(e:React.FormEvent<HTMLInputElement>) => setValue(e.currentTarget.value)}/>
                <input type="submit" />
            </form>
        </div>
    )
}

export default LoginTfa;
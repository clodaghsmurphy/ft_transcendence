import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom'
import axios from "axios";
import { AxiosResponse, AxiosError } from 'axios';
import { AuthContext } from '../../App';
import {  Navigate } from 'react-router-dom';
import { ActionKind } from "../../store/reducer";
import ball from '../../media/Ball.svg';
import paddle from '../../media/Paddle.svg'
import OtpInput from '../Components/OtpInput';


function LoginTfa()
{
    const [value, setValue] = useState('');
    const [ token, setToken] = useState('');
    const location = useLocation();
    const [error, setError ] = useState('');

	const { state,  dispatch } = useContext(AuthContext);

    async function getPayload () 
	{
		const { data } = await axios.get(`http://${window.location.hostname}:3042/auth/profile`);
			dispatch(
				{
					type: ActionKind.Login,
					payload: { user:{ name:data.name, id:data.id, avatar:`http://${window.location.hostname}:8080/api/user/image/${data.id}`, otp_enabled:data.otp_enabled}, isLoggedIn: true}
				}
			)
			localStorage.setItem("isLoggedIn", 'true');
	}

    useEffect(() => {
        const url = window.location.href;
		
		if (url.includes("?access_token"))
		{
			setToken(new URLSearchParams(location.search).get('access_token')!);   
        }
    }, [])

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();
            axios.post(`http://${window.location.hostname}:3042/auth/auth2fa`,
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

     const onChange = (input:string) => setValue(input)
    return (
      
            <main>
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
                <div className='login-two-factor'>
                    <div className='pop-up-title'>Please enter 2fa code</div>
                            <form onSubmit={handleSubmit} style={{'display' : 'flex', 'flexDirection': 'column', 'justifyContent': 'center', 'alignItems': 'center'}} >
                                
                                 {error ? <div style={{'textAlign' : 'center', 'color' : 'red' }}>Incorrect password</div> : null}
                                <div style={{'display' : 'flex', 'flexDirection': 'row'}}>
                                    <OtpInput value={value} valueLength={6} onChange={onChange}/>
                                </div>
                                <button className='submit-popup' type="submit" >Verfiy</button>
                            </form>
                    </div>
                </div>
			<div className="horizon-divide"></div>
			<div className="floor"></div>

		</main>
            
        
    )
}

export default LoginTfa;
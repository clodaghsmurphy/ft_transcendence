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
import ChangeName from './ChangeName';
import ChangePhoto from './ChangePhoto';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify'

function Welcome() {

	const { state,  dispatch } = useContext(AuthContext);


    return (
    
        <main>
            <ToastContainer
					theme='colored'
				/>
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
                <div className='pop-up-title'>Welcome user please choose a name and photo or click submit directly to use default</div>
                 <ChangeName />
                 <ChangePhoto />
            <button className='submit-popup' onClick={() => window.location.replace(`http://${window.location.hostname}:8080/stats`)}>
            <Link to='stats' style={{color:'white', fontSize: '1em', textDecoration: 'none'}}>Submit</Link>

            </button>
                </div>
            </div>
        <div className="horizon-divide"></div>
        <div className="floor"></div>

    </main>
        
    
    )
}

export default Welcome;
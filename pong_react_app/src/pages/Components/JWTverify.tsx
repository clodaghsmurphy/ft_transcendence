import React from 'react';
import axios from 'axios';
import { AuthContext } from '../../App';
import { useContext } from 'react';
import { ActionKind } from "../../store/reducer";
import { useEffect } from 'react';
import { useLocation } from "react-router-dom";


function JWTverfiy()
{
    const { state,  dispatch } = useContext(AuthContext);
    const location = useLocation();


    const parseJwt = (token:string) => {
        try {
            return JSON.parse(atob(token.split(".")[1]));
        } catch(e) {
            return null;
        }
    } 

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token)
        {
            const decodedJwt = parseJwt(token);
            if (decodedJwt.exp * 1000 < Date.now())
            {
                dispatch ({
                    type: ActionKind.Logout
                });
                localStorage.clear();
            }
            else
            {
			    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            }

        }
    }, [location]);
   

    return (<div></div>);
}

export default JWTverfiy;
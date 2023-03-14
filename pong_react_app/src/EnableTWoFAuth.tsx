import React from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { AuthContext } from './App'
import { initialState, reducer, State, ActionKind } from "./store/reducer"

const EnableTwoFAuth = () =>
{
    const { state,  dispatch } = useContext(AuthContext);
    
    const enabled = 1;
    return (
    <>
        {enabled ? 
        <li className="options-list-item">Disable Two Factor</li> :
        <li className="options-list-item">Enable Two Factor</li>
        }
    </>
    );
}

export default EnableTwoFAuth;
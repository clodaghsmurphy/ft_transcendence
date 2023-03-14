import React from 'react'
import axios from 'axios'
import { useContext, useState } from 'react'
import { AuthContext } from './App'
import { initialState, reducer, State, ActionKind } from "./store/reducer";
import PopUp2FA from './PopUp2FA';

const EnableTwoFAuth = () =>
{
    const [show, setShow] = useState<boolean>(false);
    const { state,  dispatch } = useContext(AuthContext);
    console.log(state.user);
    console.log(state.user.is2FA);
    

    const enable = async () =>
    {
        setShow(!show);
    }
    const enabled = state.user.is2FA;
   
    if (enabled)
    {
        return (
            <>
            <li className="options-list-item">Disable Two Factor</li>
            { show ? <PopUp2FA show={show} setShow={setShow}/> : null }
            </>
        )
    }
    else
    {
        return (
            <>
            <li className="options-list-item" onClick={enable}>Enable Two Factor</li>
            { show ? <PopUp2FA show={show} setShow={setShow}/> : null }
            </>
            )
    }
}

export default EnableTwoFAuth;
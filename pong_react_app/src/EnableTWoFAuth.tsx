import React from 'react'
import axios from 'axios'
import { AxiosResponse, AxiosError} from 'axios'
import { useContext, useState, useEffect } from 'react'
import { AuthContext } from './App'
import { initialState, reducer, State, ActionKind } from "./store/reducer";
import PopUp2FA from './PopUp2FA';

const EnableTwoFAuth = () =>
{
    const [show, setShow] = useState<boolean>(false);
    const { state,  dispatch } = useContext(AuthContext);
    const [ enabled, setEnabled] = useState<boolean>(state.user.otp_enabled)

    const enable = async () =>
    {
        setShow(!show);
       
    }
    useEffect(() =>
    {
        setEnabled(state.user.otp_enabled)
    }, [state.user.otp_enabled]);
    const disable = async () =>
    {
        console.log('in disable');
        axios.post(`http://${window.location.hostname}:8080/api/auth/disable2fa`)
        .then(function (res:AxiosResponse) {
            dispatch({
                type: ActionKind.userUpdate,
                payload:{ user:{ name:res.data.name, id:res.data.id, avatar:`http://${window.location.hostname}:8080/api/user/image/${res.data.id}`, otp_enabled:res.data.otp_enabled}} 
                })
            alert('2FA disabled ')
            })
        .catch((e:AxiosError) => console.log(e))
 
     }
   
    if (enabled)
    {
        return (
            <>
            <li className="options-list-item" onClick={disable}>Disable Two Factor</li>
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
import react from 'react'
import axios from 'axios'
import { AxiosResponse, AxiosError } from 'axios'
import { useEffect, useState, useContext } from 'react';
import './stats.css';
import { AuthContext } from '../../App';
import { ActionKind } from "../../store/reducer";
import OtpInput from '../Components/OtpInput';
import { toast } from 'react-toastify'


interface PopUpProps
{
    show: boolean,
    setShow: any
}

function PopUp2FA(props: PopUpProps)
{
    const { state,  dispatch } = useContext(AuthContext);
    const [imageSrc, setImageSrc] = useState("");
    const [value, setValue] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchQR()
        {
            axios.get(`http://${window.location.hostname}:8080/api/auth/generate`)
            .then((response:AxiosResponse) => setImageSrc(response.data.code))
            .catch((e:AxiosError) => console.log(e))  
            
        }
        fetchQR();
    }, []);

    const handleSubmit = async () =>
    {
        axios.post(`http://${window.location.hostname}:8080/api/auth/validate`, {totp: value})
        .then(function (res:AxiosResponse) {
            console.dir(res)
            dispatch({
                type: ActionKind.userUpdate,
                payload:{ user:{ name:res.data.name, id:res.data.id, avatar:`http://${window.location.hostname}:8080/api/user/image/${res.data.id}`, otp_enabled:res.data.otp_enabled}} 
                })
            alert('2FA enabled !');
            props.setShow(!props.show);
    })
    .catch(function (error:AxiosError) {
                
        if( error.request.status  === 401) {
            setError('Incorrect authentication code')
            toast.error('Incorrect authentication code');
        }
               
    });  
    }

    const onChange = (input:string) => setValue(input)
    return (
        <div className="TwoFactorPopUp">
           
            <div className="instructions">
                <div className="pop-up-title">Enable 2FA</div>
                <div>
                    <ol style={ { 'padding': 0} }>
                    <li>Scan qr code in google authneticator app on your phone</li>
                    <li>Scan using google authenticator chrome extension</li>
                        <li>Nest you will receive a code, please enter it below</li>
                    </ol>
                </div>
            </div>
            <div className="QRcode">
                <img src={imageSrc} alt="QR code" />
            </div>
            { error ? <div style={{'color': 'red', 'overflow' : 'visible', 'flexBasis': '6vh'}}>{error}</div> : null }
            <div className='qr-input'>
                <OtpInput value={value} valueLength={6} onChange={onChange}/>
            </div>
            <div className="buttons">
                <button className='cancel-popup' onClick={() => { props.setShow(!props.show)}}>Close</button>
                <button className='submit-popup' type="submit" onClick={handleSubmit}>Verfiy</button>
            </div>
        </div>
    );
}

export default PopUp2FA; 
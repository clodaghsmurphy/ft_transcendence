import react from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react';
import './stats.css';

interface PopUpProps
{
    show: boolean,
    setShow: any
}

function PopUp2FA(props: PopUpProps)
{
    const [imageSrc, setImageSrc] = useState("");
    const [value, setValue] = useState("");
    console.log(axios.defaults.headers.common);

    useEffect(() => {
        async function fetchQR()
        {
            console.log('in use effects pop up');
            console.log('headers');
            const response = await axios.get('http://localhost:3042/auth/generate');
            console.log('after response');
            console.log(response);
            setImageSrc(response.data.code)
        }
        fetchQR();
    }, []);

    const handleSubmit = async () =>
    {
        console.log('in handle sucmit');
        const response = await axios.post('http://localhost:3042/auth/validate',
        {
            totp: value,
        })
        console.log(response);
    }
    return (
        <div className="TwoFactorPopUp">
           
            <div className="instructions">
                <div className="pop-up-title">Enable 2FA</div>
                <div>
                    <ul>
                    <li>Scan qr code in google authneticator app on your phone</li>
                    <li>Scan using google authenticator chrome extension</li>
                        <li>Nest you will receive a code, please enter it below</li>
                    </ul>
                </div>
            </div>
            <div className="QRcode">
                <img src={imageSrc} alt="QR code" />
            </div>
            <div> Code alternative here</div>
            <div>Enter authorization code here
                <input type="text" value={value} onChange={(e:React.FormEvent<HTMLInputElement>) => {setValue(e.currentTarget.value)}}/>
            </div>
            <div className="buttons">
                <button onClick={() => { props.setShow(!props.show)}}>Close</button>
                <button type="submit" onClick={handleSubmit}>Verfiy</button>
            </div>
        </div>
    );
}

export default PopUp2FA; 
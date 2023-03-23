import React from 'react';
import { useState, useContext, useEffect } from 'react'
import { AuthContext } from './App';
import axios from 'axios';
import { AxiosResponse, AxiosError} from 'axios'


function ChangePhoto() {
    const [showPhoto, setShowPhoto] = useState(false);
    const [ file, setFile] = useState<File>();
	const [value, setValue] = useState("");
	const { state, dispatch } = useContext(AuthContext);

    const submitPhoto = async (event: React.FormEvent<HTMLFormElement>) =>
    {
        console.log('in submit');
        console.log(file);
        event.preventDefault();
        if (!file)
            return ;
        const formData = new FormData();
        formData.append('file', file);
        axios.post(`http://${window.location.hostname}:8080/api/user/upload`
        ,formData
        , { headers: {
            'Content-Type' : 'multipart/form-data'
        }}
        )
        .then((res:AxiosResponse) => console.log("RES : " + res.data))
        .catch((error:AxiosError) => console.log('Error : ' + error))
    
        setShowPhoto(!showPhoto);
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.files)
            setFile(e.currentTarget.files[0]);
    }


    return (
        <>
		<li className="options-list-item" onClick={() => {setShowPhoto(!showPhoto)}}>Change Photo</li >
		{ showPhoto ? 
		<div className='SmallPopUp'>
			<div className='popup-header'>Upload image</div>
			<form className='popup-form' onSubmit={submitPhoto}>
				<input type="file" accept="image/*" multiple={false} className='file-input' onChange={handleFileChange}/>
                <div className='buttons'>
                    <button type='submit' className='submit-popup'>Submit</button>
                    <button className='cancel-popup'>Cancel</button>
                </div>
			</form>
		</div> 
		: null
		}
		</>
    ) ;
}

export default ChangePhoto;
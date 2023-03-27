import React from 'react';
import { useState, useContext, useEffect } from 'react'
import { AuthContext } from './App';
import axios from 'axios';
import { AxiosResponse, AxiosError} from 'axios';
import { ActionKind } from "./store/reducer"


function ChangePhoto() {
    const [showPhoto, setShowPhoto] = useState(false);
    const [ file, setFile] = useState<File>();
	const [value, setValue] = useState("");
    const [error, setError] = useState("");
	const { state, dispatch } = useContext(AuthContext);


    const setImage = async (path: string) => {
        path = "." + path;
        state.user.avatar = path; 
         dispatch(
            {
                type: ActionKind.userUpdate,
                payload: { user:state.user },
            }
        )
        console.log(state.user.avatar)
    }

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
        .then(function(res:AxiosResponse) {
         console.dir(res);
         setError('');
        setShowPhoto(!showPhoto);
        setImage(res.data.avatar);
            
        
        console.log(state.user.avatar);

        })
        .catch(function (error:AxiosError) 
        {
            if(error.response && error.response.status == 413)
                setError('File too large, image must be under 2MB');
            console.log('error : ' + error)

        })
    }

   

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.files)
            setFile(e.currentTarget.files[0]);
    }

    const handleCancel =() => {
        setShowPhoto(!showPhoto); 
        setError('');
    }


    return (
        <>
		<li className="options-list-item" onClick={() => {setShowPhoto(!showPhoto)}}>Change Photo</li >
		{ showPhoto ? 
		<div className='SmallPopUp'>
			<div className='popup-header'>Upload image</div>
			<form className='popup-form' onSubmit={submitPhoto}>
				<input type="file" accept="image/*" multiple={false} className='file-input' onChange={handleFileChange}/>
                { error ? <span>{error}</span> : null}
                <div className='buttons'>
                    <button type='submit' className='submit-popup'>Submit</button>
                    <button className='cancel-popup' onClick={handleCancel}>Cancel</button>
                </div>
			</form>
		</div> 
		: null
		}
		</>
    ) ;
}

export default ChangePhoto;
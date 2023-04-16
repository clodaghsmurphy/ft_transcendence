import React from 'react'
import axios from 'axios'
import { useState, useContext } from 'react'
import { AuthContext } from '../../App'
import { ActionKind } from "../../store/reducer";
import { toast } from 'react-toastify'

const ChangeName = () =>
{
	const [showName, setShowName] = useState(false);
	const [value, setValue] = useState("");
	const { state, dispatch } = useContext(AuthContext);


	const submitName = async () =>
	{
		dispatch(
			{
				type: ActionKind.nameUpdate,
				payload: { login:value },
			})
			try{
				const { data } = await axios.post(`http://${window.location.hostname}:8080/api/user/update`, {
						id: state.user.id,
					name: value,
					});
					dispatch(
						{
							type: ActionKind.userUpdate,
							payload: { user:{ name:data.name, id:data.id, avatar:`http://${window.location.hostname}:8080/api/user/image/${data.id}`, otp_enabled:data.otp_enabled}, isLoggedIn: true},
						}
					)

			} catch (e) {
				if (axios.isAxiosError(e)) {
					if (e.response?.status === 400)
						toast.error(`Name Error: ${e.response?.data.error}`);
					else {
						toast.error('Name error, cannot change name');
					}
				}
			}
		setShowName(!showName);

	}

	return(
		<>
		<li className="options-list-item" onClick={() => {setShowName(!showName)}}>Change Name</li >
		{ showName ?
		<div className='SmallPopUp'>
			<div className='popup-header'>Please input name</div>
			<div className='popup-input'>
				<input type="text" placeholder='Enter name..' onChange={(e:React.FormEvent<HTMLInputElement>) => setValue(e.currentTarget.value)}></input>
			</div>
			<div className='buttons'>
				<button type='submit' className='submit-popup' onClick={submitName}>Submit</button>
				<button className='cancel-popup' onClick={() => setShowName(!showName)}>Cancel</button>
			</div>
		</div>
		: null
		}
		</>
	);
}

export default ChangeName;

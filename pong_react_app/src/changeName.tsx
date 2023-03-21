import React from 'react'
import axios from 'axios'
import { useState, useContext } from 'react'
import { AuthContext } from './App'
import { ActionKind } from "./store/reducer"


interface nameProps
{
	showName: boolean,
	setShowName: any		
}


const ChangeName = () =>
{
	const [showName, setShowName] = useState(false);
	const [value, setValue] = useState("");
	const { state, dispatch } = useContext(AuthContext);


	const submitName = async () =>
	{
		console.log('in submit');
		console.log(value);
		console.log(state)
		dispatch(
			{
				type: ActionKind.nameUpdate,
				payload: { login:value },
			})
		const { data } = await axios.post('http://localhost:3042/user/update', { 
				id: state.user.id,
			name: value,
			});
			dispatch(
				{
					type: ActionKind.userUpdate,
					payload: { user:data },
				}
			)
			console.log('datais');
			console.log(data);
			console.log('state is ');
		console.log(state);
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
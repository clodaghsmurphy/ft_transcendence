import React from 'react'
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


	const submitName = () =>
	{
		console.log(value)
		console.log(state.user);
		state.user.login = value;
		dispatch(
			{
				type: ActionKind.nameUpdate,
				payload: { login:value },
			})
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
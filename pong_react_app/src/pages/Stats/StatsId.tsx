import React, { useEffect, Suspense, useState, useContext } from "react";
import './stats.css';
import { AuthContext } from "../../App";
import { useParams, useNavigate } from 'react-router-dom'
import axios, { AxiosResponse, AxiosError} from 'axios';
import { user } from "../../store/reducer";
import { ErrorObject, ActionKind } from "../../store/reducer";
import StatsIdUser from "./StatsIdUser";
import Loading from "../Components/Loading";


function StatsId()
{
	const emptyUser:user = {
		name:'',
		id: '',
		otp_enabled: false,
		avatar: '',
	}
	const { state, dispatch } = useContext(AuthContext);
	const [usr, setUser] = useState<user>(emptyUser);
	const id = useParams();
	const navigate = useNavigate();


	useEffect(() => {
		document.title = 'Stats';
		axios.get(`http://localhost:8080/api/user/info/${id.id}`)
		.then(function(response:AxiosResponse){
			 const res = response.data;
			 const updateValue:user = { name: res.name, id: res.id, avatar: res.avatar, otp_enabled: res.otp_enabled }
			setUser(updateValue);
		})
		.catch(function(e:AxiosError) {
			console.log(e);
			const errorObj:ErrorObject = {
				type: 'StatsId',
				message: e.message,
			}
			dispatch({
				type: ActionKind.errorUpdate,
				payload: errorObj
			})
			navigate('/stats')
		})
	}, []);
	
	return(	
		<>
			{ usr !== emptyUser ?
			<StatsIdUser usr={usr} />
		: <Loading />} 
		</>
	);
}


export default StatsId;
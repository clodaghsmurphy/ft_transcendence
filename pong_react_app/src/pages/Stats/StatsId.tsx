import React, { useEffect, Suspense, useState, useContext } from "react";
import './stats.css';
import { AuthContext } from "../../App";
import { Link, useParams, useNavigate } from 'react-router-dom'
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
	const [open, setOpen] = useState(false);
	const { state, dispatch } = useContext(AuthContext);
	const [usr, setUser] = useState<user>(emptyUser);
	const [ isLoading, SetisLoading] = useState(true);
	const id = useParams();
	const navigate = useNavigate();


	useEffect(() => {
		document.title = 'Stats';
		axios.get(`http://localhost:8080/api/user/info/${id.id}`)
		.then(function(response:AxiosResponse){
			 const res = response.data;
			 const updateValue:user = { name: res.name, id: res.id, avatar: res.avatar, otp_enabled: res.otp_enabled }
			 console.log('before set suer');
			setUser(updateValue);
			SetisLoading(false);
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

	
	const handleOpen = () =>
	{
		setOpen(!open);
	};
	
	console.log(isLoading);
	// if (usr === emptyUser) {
	// 	return <div>Loading...</div>;
	// }
	
	return(	
		<>
			{ usr !== emptyUser ?
			<StatsIdUser usr={usr} />
		: <Loading />} 
		</>
	);
}


export default StatsId;
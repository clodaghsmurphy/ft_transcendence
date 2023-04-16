import React, { useState, useMemo, useEffect} from 'react'
import axios, { AxiosError, AxiosResponse} from 'axios'
import { toast } from 'react-toastify';
import loading from '../../media/load-loading.gif'

const status ={
	none: 0,
	online: 1,
	offline: 2,
}
type Props = {
	id: number,
	status: number,
}

function Image(props: Props) {
	const [image, setImage] = useState(loading);
	const [ online, setOnline ] = useState(false);

	useEffect(() => {
		getOnline()
	}, [props.id])
	const getOnline = async () => {
		try {
			const result = await axios.get(`http://${window.location.hostname}:8080/api/user/info/${props.id}/connected`)
			if (props.status === 1 && result.data.attribute === true)
				setOnline(true);
		}
		catch(e){
			console.log(e);
		}
	}

	const memoizedImage  = useMemo(() => {
		return (
			<img src={`http://${window.location.hostname}:8080/api/user/image/${props.id}`} alt='avatar' />
		)
	}, [])
	
	return (
		<>
		<div className="img-container">
			{memoizedImage}
		</div>
			{ online ? <span className='online'></span> : <span className='offline' ></span>}
		</>
	)
}

export default Image;
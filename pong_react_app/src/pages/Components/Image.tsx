import React, { useState, useEffect} from 'react'
import axios, { AxiosError, AxiosResponse} from 'axios'
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

	useEffect(() => {
		axios.get(`http://${window.location.hostname}:8080/api/user/image/${props.id}`, { responseType: 'arraybuffer' })
		.then(function (response:AxiosResponse) {
			const blob = new Blob([response.data], { type: response.headers['content-type'] });
			setImage(URL.createObjectURL(blob));
		})
		.catch((error:AxiosError) => console.log(error))
	}, [])
	return (
		<>
		<div className="img-container">
				<img src={image} alt='profile picture'/>
		</div>
			{ props.status ? <span className='online'></span> : null}
		</>
	)
}

export default Image;
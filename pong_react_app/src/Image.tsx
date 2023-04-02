import React, { useState, useEffect} from 'react'
import axios, { AxiosError, AxiosResponse} from 'axios'

type Props = {
	id: string
}

function Image(props: Props) {
	const [image, setImage] = useState('');

	useEffect(() => {
		axios.get(`http://${window.location.hostname}:8080/api/user/image/${props.id}`, { responseType: 'arraybuffer' })
		.then(function (response) {
			const blob = new Blob([response.data], { type: response.headers['content-type'] });
			setImage(URL.createObjectURL(blob));
		})
		.catch((error:AxiosError) => console.log(error))
	}, [])
	return (
		<>
			<img src={image} />
		</>
	)
}

export default Image;
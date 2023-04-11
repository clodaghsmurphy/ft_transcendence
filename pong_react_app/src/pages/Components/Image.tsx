import React, { useState, useMemo} from 'react'
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

	const memoizedImage  = React.useMemo(() => {
		console.log('in memo')
		return (
			<img src={`http://${window.location.hostname}:8080/api/user/image/${props.id}`} alt='avatar' />
		)
	}, [])
	
	return (
		<>
		<div className="img-container">
			{memoizedImage}
		</div>
			{ props.status ? <span className='online'></span> : null}
		</>
	)
}

export default Image;
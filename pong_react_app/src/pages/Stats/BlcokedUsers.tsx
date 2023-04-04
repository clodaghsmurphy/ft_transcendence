import React from "react";
import { useState, useEffect } from 'react'

type Props = {
	value:string
}
function BlcokedUsers(props:Props) {
	let [ friendsRequests, setFriendRequest] = useState([]);
	useEffect(() => {
		console.log(props.value)
	}, [props.value])

	return (
		<div className="info-body">
			{friendsRequests}
		</div>
	)
}

export default BlcokedUsers;
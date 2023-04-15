import axios, { AxiosError, AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function BrowseGames() {
	let [GamesBlocks, setGamesBlocks] = useState([] as JSX.Element[])

	useEffect(() => {
		let tmp = []
		let data: any[] = []

		axios.get('/api/game/')
			.then((response: AxiosResponse) => {
				data = response.data

				for (const game of data) {
					tmp.push()
				}
			})
			.catch((err: AxiosError) => {
				toast.error('Could not fetch games')
			})
		
	}, [])

	return (
		<div>
			
		</div>
)
}

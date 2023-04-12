import React from 'react'
import { Channel } from './Channels'
import { socket_chan, ChanAndMessage, CurrentChan, CHANNEL, socket_dm } from './Chat'
import { DirectMessage } from './DirectMessage'
import User, { id_to_user } from '../utils/User'
import axios, { AxiosResponse, AxiosError } from 'axios'
import { sanitizeString } from './ChatUtils'
import { toast } from 'react-toastify'
import { channel } from 'diagnostics_channel'

export type ChatVariables = {
	all_users?: User[],
	all_channels?: Channel[],
	current_user?: User,
	current_chan?: CurrentChan,
	chanOfUser?: Channel[],
	dms?: DirectMessage[],
	set_all_users?: React.Dispatch<React.SetStateAction<User[]>>,
	set_all_channels?: React.Dispatch<React.SetStateAction<Channel[]>>,
	set_current_user?: React.Dispatch<React.SetStateAction<User>>,
	set_current_chan?: React.Dispatch<React.SetStateAction<CurrentChan>>,
	setChanOfUser?: React.Dispatch<React.SetStateAction<Channel[]>>,
	set_dms?: React.Dispatch<React.SetStateAction<DirectMessage[]>>,
}

export function handleBan(vars: ChatVariables) {

	socket_chan.removeListener('ban')

	const ban_function = (data: any) => {
		if (!vars.current_chan || !vars.set_current_chan ||
			!vars.all_channels || !vars.set_all_channels ||
			!vars.current_user || !vars.setChanOfUser)
			return
		
		if (vars.current_chan.type === CHANNEL) {
			vars.current_chan.chan = vars.current_chan.chan!
			let new_chan = vars.current_chan.chan!

			new_chan.members = new_chan.members
				.filter((user: number) => user !== data.target_id)
			new_chan.banned.push(data.target_id)

			vars.set_current_chan({
				type: vars.current_chan.type,
				msg: vars.current_chan.msg,
				chan: new_chan,
			})
	
			let tmp_chan = vars.all_channels.find((c: Channel) => c.name === data.name)
	
			if (typeof tmp_chan === 'undefined')
				return;	
	
			(tmp_chan as Channel).members = (tmp_chan as Channel).members.filter((user: number) => 
				user !== data.target_id
			);
			(tmp_chan as Channel).banned.push(data.target_id)
	
			vars.set_all_channels((prev: Channel[]) => {
				let ret = prev.filter((c: Channel) => 
					c.name !== data.name
				)
				ret.push((tmp_chan as Channel))
				return ret;
			})
			if (data.target_id === vars.current_user.id) {
				vars.setChanOfUser((prev: Channel[]) => {
					let ret = prev.filter((c: Channel) => 
						c.name !== data.name
					)
					return ret;
				})
				toast.error('You have been banned of channel ' + data.name)
			}
		}
	}

	socket_chan.on('ban', ban_function)
}

export function handleMessage(vars: ChatVariables) {
	socket_chan.removeListener('message')
	socket_dm.removeListener('message')

	const function_message = (param: any) => {
		if (!vars.set_current_chan || !vars.current_chan)
			return
		if (typeof vars.current_chan.msg === 'undefined')
			return;

		vars.set_current_chan((current_chan: CurrentChan) => ({
			...current_chan,
			msg: [...current_chan.msg, param]
		}));
	}

	socket_chan.on('message', function_message)
	socket_dm.on('message', function_message)
}

export function  handleMute(vars: ChatVariables) {
	// lol
}

export function handleMakeop(vars: ChatVariables) {
	socket_chan.removeListener('makeop')

	const handleMakeop = (data: any) => {
		if (!vars.set_current_chan)
			return
		vars.set_current_chan((prev: CurrentChan) => ({
			...prev,
			chan: {
				...(prev as ChanAndMessage).chan,
				operators: [...(prev as ChanAndMessage).chan.operators, data.target_id],
			}
		}))
	}

	socket_chan.on('makeop', handleMakeop)
}

export function handleJoin(vars: ChatVariables) {
	socket_chan.removeListener('join')

	const function_join = (data: any) => {
		if (!vars.set_current_chan || !vars.set_all_channels ||
			!vars.setChanOfUser || !vars.all_channels)
			return

		let chan_name = data.name;
		if (typeof vars.all_channels!.find((chan: Channel) => 
				chan.name === chan_name
			) === 'undefined') // Si le chan existe pas
		{
			console.log('didnt found channel', data.name)
			axios.get('/api/channel/info/' + sanitizeString(chan_name))
				.then((response: AxiosResponse) => {
					vars.set_all_channels!((prev: Channel[]) => [...prev, response.data])
					vars.setChanOfUser!((prev: Channel[]) => [...prev, response.data])

					axios.get('/api/channel/' + sanitizeString(response.data.name) + '/messages/')
						.then((response_messages: AxiosResponse) => {
							vars.set_current_chan!({
								chan: response.data as Channel,
								msg: response_messages.data,
								type: CHANNEL,
							})
						})
						.catch((err: AxiosError) => {
							if (err) {
								toast.error('Couldn\'t fetch ' + chan_name + ' messages');
							}
						})
				})
				.catch((err: AxiosError) => {
					if (err) {
						toast.error('Couldn\'t fetch channel ' + chan_name);
					}
				})
		}
	}

	socket_chan.on('join', function_join)
}

export function handleKick(vars: ChatVariables) {
	socket_chan.removeListener('kick')

		const function_kick = (data: any) => {
			if (!vars.set_current_user || !vars.all_channels ||
				!vars.set_all_channels || !vars.set_current_chan || 
				!vars.current_user || !vars.setChanOfUser)
				return
			
			vars.set_current_chan((prev: CurrentChan) => ({
				...prev,
				chan: {
					...(prev as ChanAndMessage).chan,
					members: (prev as ChanAndMessage).chan.members
						.filter((user: number) => user !== data.target_id)
				}
			}))

			let tmp_chan = vars.all_channels.find((c: Channel) => c.name === data.name)

			if (typeof tmp_chan === 'undefined')
				return;	

			(tmp_chan as Channel).members = (tmp_chan as Channel).members.filter((user: number) => 
				user !== data.target_id
			)

			vars.set_all_channels((prev: Channel[]) => {
				let ret = prev.filter((c: Channel) => 
					c.name !== data.name
				)
				ret.push((tmp_chan as Channel))
				return ret;
			})
			if (data.target_id === vars.current_user.id) {
				vars.setChanOfUser((prev: Channel[]) => {
					let ret = prev.filter((c: Channel) => 
						c.name !== data.name
					)
					return ret;
				})
				toast.warn('You have been kicked of channel ' + data.name)
			}
		}

		socket_chan.on('kick', function_kick)
}

export function handleCreate(vars: ChatVariables) {
	socket_chan.removeListener('create')

	const function_create = (data: any) => {
		if (!vars.all_channels || !vars.setChanOfUser ||
			!vars.set_all_channels)
			return

		if (vars.all_channels.find((c: Channel) => c.name === data.name)) {
			vars.setChanOfUser((prev: Channel[]) => [...prev, data as Channel])
			vars.set_all_channels((prev: Channel[]) => [...prev, data as Channel])
		}
	}

	socket_chan.on('create', function_create)
}
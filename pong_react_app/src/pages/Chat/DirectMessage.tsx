import React from 'react'
import { MessageData, NORMAL } from './Channels'
import User from '../utils/User'

export type DirectMessage = {
	user: number, // Tableau avec les id des deux participants
	msg: MessageData[],
}

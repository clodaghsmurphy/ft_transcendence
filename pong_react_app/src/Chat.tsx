import React, { NamedExoticComponent } from 'react'
import NavBar from './NavBar'
import './Dashboard.css'
import './Chat.css'
import {useState} from 'react'
import adam from './media/adben-mc.jpg'
import pierre from './media/ple-lez.jpg'
import clodagh from './media/clmurphy.jpg'
import nathan from './media/nguiard.jpg'
import group_img from './media/group.png'
import search_icon from './media/search-icon.jpg'

type User_message = {name: string, message: string, img: string}
type Group_message = {name: string, message: string}

function chat_button(name: string, message: string, img: string) {
	return (
		<button className='chat-button'>
			<img src={img}></img>
			<div>
				<h2>{name}</h2>
				<div>{message}</div>
			</div>
		</button>
	);
}

function users_message(user_data: User_message[]) {
	let ret: JSX.Element[] = [];

	for (const user of user_data) {
		ret.push(chat_button(user.name, user.message, user.img));
	}
	return ret;
}

function group_message(group_data: Group_message[]) {
	let ret: JSX.Element[] = [];

	for (const group of group_data) {
		ret.push(chat_button(group.name, group.message, group_img));
	}
	return ret;
}

function Chat()
{
	let message_user_data: User_message[] = [
		{
			"name": "nguiard",
			"message": "jsp quoi dire",
			"img": nathan,
		},
		{
			"name": "clmurphy",
			"message": "webserv > irc",
			"img": clodagh,
		},
		{
			"name": "adben-mc",
			"message": "18h == matin",
			"img": adam,
		},
		{
			"name": "ple-lez",
			"message": "je speedrun le TC",
			"img": pierre,
		}
	];

	let group_message_data: Group_message[] = [
		{
			"name": "Trascendence",
			"message": "Salut tout le monde!",
		},
		{
			"name": "Groupe 2",
			"message": "bla bla bla bla bla bla bla bla bla",
		},
		{
			"name": "Illuminatis",
			"message": "On vas conquerir le monde",
		},
	];

	return (	
		<div className="dashboard">
        <NavBar /> 
        <main className="page-wrapper">
            <div className="channels">
				<h1>Messages</h1>

				<div>
				<input className='search_bar' placeholder='search'/>
					{/* search
				</input> */}
					{/* <button type='submit'>
						<img src="./media/search-icon.jpg"></img>
					</button> */}
				</div>

				<div className='bar'></div>
				<div className='lists'>
					<h1>Group chats</h1>
					{group_message(group_message_data)}
				</div>

				<div className='bar'></div>
				<div className='lists'>
					<h1>User messages</h1>
					{users_message(message_user_data)}
				</div>
				{/* Cette div sert a "contenir" celles d'au dessus pour
					eviter qu'elles depacent de la fenetre				*/}
				<div className='channels-holder'></div>
			</div>

            <div className="chatbox"></div>

            <div className="group-members">
				<h1>Group users</h1>
				

				<button
					// style={{background-color: '#A09F9F'}} couleur conditionnelle (bloque/ami/autre)
					className='users-box'>
					<img src={adam}></img>
					Hello world
				</button>
			</div>
        </main>
        </div>
    );
}

export default Chat;
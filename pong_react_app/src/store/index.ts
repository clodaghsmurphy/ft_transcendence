import api_keys from "../api_cred"
import React, { type Dispatch, createContext, useReducer } from 'react';

type State =
{
	isLoggedIn:boolean;
	user:string;
	client_id:string;
	redirect_uri:string;
	cleint_secret:string;
	proxy_url:string;
};

type Action = {
	type: "LOGIN" | "LOGOUT";
	payload?: string;
};


export const initialState =
{
	isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn"))  || '{}',
	user: JSON.parse(localStorage.getItem("user")) || "{}",
	client_id: process.env.REACT_APP_CLIENT_ID,
	redirect_uri: process.env.REACT_APP_REDIRECT_URI,
	client_secret: process.env.REACT_APP_CLIENT_SECRET,
	proxy_url: process.env.REACT_APP_PROXY_URL,
	dispatch: null
}

export const reducer = (state:State,action:Action) =>
{
	switch( action.type)
	{
		case "LOGIN":
			{
				localStorage.setItem("isLoggedIn", JSON.stringify(action.payload.isLoggedIn))
				localStorage.setItem("user", JSON.stringify(action.payload.user))
				return {
					... state,
					isLoggedIn: action.payload.isLoggedIn,
					user:action.payload.user
				};
			}
	}
}
import React from 'react'

export type State = {
    isLoggedIn: boolean,
    user: user,
    client_id: string,
    redirect_uri: string,
    client_secret: string,
    proxy_url: string
};

export enum ActionKind {
  Login = "LOGIN",
  Logout = "LOGOUT"
}

export interface Login
{
  type: ActionKind.Login;
  payload: any;
}

export interface Logout
{
  type: ActionKind.Logout;
  payload: any;
}

export type Action =
{
    type: ActionKind;
    payload?:any;   

};

export type user = 
{
  login:string;
  id: string;
  avatar: string;

}

export const initialState:State = {
    isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")!) ,
    user: { login: 'clmurphy', id: '1', avatar: 'https://cdn.intra.42.fr/users/b055b9ed5ffb394bcd9f0da75db1879a/clmurphy.jpg'},
    client_id: process.env.REACT_APP_CLIENT_ID!,
    redirect_uri: process.env.REACT_APP_REDIRECT_URI!,
    client_secret: process.env.REACT_APP_CLIENT_SECRET!,
    proxy_url: process.env.REACT_APP_PROXY_URL!
  };
  
  export const reducer = (state:State, action:Action) => {
    switch (action.type) {
      case "LOGIN": {
        localStorage.setItem("isLoggedIn", JSON.stringify(action.payload.isLoggedIn))
        localStorage.setItem("user", JSON.stringify(action.payload.user))
        return {
          ...state,
          isLoggedIn: action.payload.isLoggedIn,
          user: action.payload.user
        };
      }
      case "LOGOUT": {
        localStorage.clear()
        return {
          ...state,
          isLoggedIn: false,
          user: null
        };
      }
      default:
        return state;
    }
  };
import React from 'react'

export type State = {
    isLoggedIn: string,
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
  is2FA: boolean;

}

export const initialState:State = {
    isLoggedIn: localStorage.getItem("isLoggedIn")! ,
    user: JSON.parse(localStorage.getItem('user')!) ,
    client_id: process.env.REACT_APP_CLIENT_ID!,
    redirect_uri: process.env.REACT_APP_REDIRECT_URI!,
    client_secret: process.env.REACT_APP_CLIENT_SECRET!,
    proxy_url: process.env.REACT_APP_PROXY_URL!
  };
  
  export const reducer = (state:State, action:Action) => {
    switch (action.type) {
      case "LOGIN": {

        localStorage.setItem("isLoggedIn", JSON.stringify(action.payload.isLoggedIn))
        localStorage.setItem("user", JSON.stringify(action.payload.user));
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
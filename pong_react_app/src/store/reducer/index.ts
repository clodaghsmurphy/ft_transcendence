import React from 'react'
import axios from 'axios'

export type State = {
    isLoggedIn: string,
    user: user,
    error: ErrorObject | null,
};

export type ErrorObject = {
  type: string,
  message: string
}

export enum ActionKind {
  Login = "LOGIN",
  Logout = "LOGOUT",
  nameUpdate = "NAME_UPDATE",
  userUpdate = "USER_UPDATE",
  enable2fa = "ENABLE_TFA",
  errorUpdate= "ERROR_UPDATE"
}

export interface Login
{
  type: ActionKind.Login;
  payload: any;
}

export interface nameUpdate {
  type: ActionKind.nameUpdate;
  payload: string;
}

export interface userUpdate {
  type: ActionKind.userUpdate;
  payload: user;
}

export interface errorUpdate {
  type: ActionKind.errorUpdate;
  payload: ErrorObject;
}


export interface Logout
{
  type: ActionKind.Logout;
  payload: any;
}

export interface enable2fa
{
  type: ActionKind.enable2fa;
  payload: boolean;
}

export type Action =
{
    type: ActionKind;
    payload?:any;   

};

export type user = 
{
  name:string;
  id: string;
  avatar: string;
  otp_enabled: boolean;

}

export const initialState:State = {
    isLoggedIn: localStorage.getItem("isLoggedIn")! ,
    user: JSON.parse(localStorage.getItem('user')!) ,
    error: null,
  };
  
  export const reducer = (state:State, action:Action) => { // {type, payload: { isLoggedIn, user }}
    switch (action.type) {
      case "LOGIN": {
        console.log('in login and payload is');
        console.log(action.payload);
        localStorage.setItem("isLoggedIn", JSON.stringify(action.payload.isLoggedIn))
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        // state.isLoggedIn = ddd
        // state.user = xxxx
        // return state
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
      case "NAME_UPDATE": {
        console.log('in dispatch and payload is');
        console.log(action.payload);
       
        
        console.log(state);
        return {
          ...state,
          login:action.payload.login,
        }
      }
      case "USER_UPDATE": {
        console.log('in user update');
        console.log(action.payload.user);
        console.log(action.payload.user.name)
			  localStorage.setItem('user', JSON.stringify(action.payload.user))
        return {
          ...state,
          user: action.payload.user,
        }
      }
      case "ERROR_UPDATE": {
        return {
          ...state,
          error: action.payload
        }
      }
 
   
      default:
        return state;
    }
  };
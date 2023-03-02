import React, { Component, useState, createContext, useContext, useReducer } from 'react';
import { render } from "react-dom";

import Home from './Home';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import './App.css';
import Dashboard from './Dashboard';
import Main from './Main';
import Chat from './Chat';
import Login from './Login';
import CallBack from './CallBack';
import { Navigate } from 'react-router-dom'
import { initialState, reducer, State, Action } from "./store/reducer"
import ProtectedRoute from './ProtectedRoute'
import { ProtectedRouteProps } from './ProtectedRoute';
import TestNathan from './TestNathan';

type StateContext = {
  state: State;
  dispatch: React.Dispatch<Action>
};

export const AuthContext = createContext<StateContext>( {state: initialState, dispatch: () => undefined } );


function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const defaultProtectedRouteProps: Omit<ProtectedRouteProps, 'outlet'> = {
    isAuth: !!state.isLoggedIn,
    authPath: '/login',
  };
  

  return (
    <AuthContext.Provider value={ { state, dispatch } }>
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/login/callback" element={<CallBack />}/>
        <Route path="/dashboard" element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Dashboard /> } /> } />
        <Route path='/main' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Main /> } /> } />
        <Route path='/chat' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Chat /> } /> } />
		<Route path='/testnathan' element={<TestNathan />}/>
	  </Routes>
    </Router>
    </AuthContext.Provider>
  );
}





export default App;

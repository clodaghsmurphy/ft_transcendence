import React, { Component, useState, createContext, useContext, useReducer } from 'react';
import { render } from "react-dom";

import Home from './Home';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import StatsId from './StatsId';
import './App.css';
import Dashboard from './Dashboard';
import Chat from './Chat';
import Login from './Login';
import LoginTfa from './LoginTfa';
import Stats from './Stats';
import { Navigate } from 'react-router-dom'
import { initialState, reducer, State, Action } from "./store/reducer"
import ProtectedRoute from './ProtectedRoute'
import { ProtectedRouteProps } from './ProtectedRoute';
import JWTverify from './JWTverify';
import { PromptContextValue, PromptContext, defaultValue } from './store/reducer/Prompt/PromptContext';

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
  
  const [prompt, setPrompt] = useState<PromptContextValue>(defaultValue);

  return (
    <AuthContext.Provider value={ { state, dispatch } }>
    <Router>
      <PromptContext.Provider value={[prompt, setPrompt]}>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/2fa" element={<LoginTfa />}/>
        <Route path="/dashboard" element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Dashboard /> } /> } />
        <Route path='/chat' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Chat />} />} />
        <Route path='/stats' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Stats />} />} />
        <Route path='/stats/:id' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<StatsId />} />} />
    </Routes>
    </PromptContext.Provider>
    <JWTverify />
    </Router>
    </AuthContext.Provider>
  );
}





export default App;

import React, { Component,type Dispatch, createContext, useReducer } from 'react';
import { render } from "react-dom";

import Home from './Home';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import './App.css';
import Dashboard from './Dashboard';
import Main from './Main';
import Chat from './Chat';
import Login from './Login';
import CallBack from './CallBack';
import { initialState, reducer } from './store';

export const AuthContext = createContext(null);


function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AuthContext.Provider
      value={{state, dispatch}} >
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/login/callback" element={<CallBack />}/>
        <Route path="/dashboard" element={< Dashboard />} />
        <Route path='/main' element={ <Main />} />
        <Route path='/chat' element={ <Chat />} />
      </Routes>
    </Router>
    </AuthContext.Provider>
  );
}

export default App;

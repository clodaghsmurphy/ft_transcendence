import React, { Component } from 'react';
import { render } from "react-dom";

import Home from './Home';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import './App.css';
import Dashboard from './Dashboard';
import Main from './Main';
import Chat from './Chat';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/dashboard" element={< Dashboard />} />
        <Route path='/main' element={ <Main />} />
        <Route path='/chat' element={ <Chat />} />
      </Routes>
    </Router>
  );
}

export default App;

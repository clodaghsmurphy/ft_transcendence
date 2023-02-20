import React, { Component } from 'react';
import { render } from "react-dom";

import Home from './Home';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import './App.css';
import Dashboard from './Dashboard';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/dashboard" element={< Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

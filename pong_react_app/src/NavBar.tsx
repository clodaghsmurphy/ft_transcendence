import React from 'react'
import './Dashboard.css'
import logo from './media/pong-logo.svg'
import user_pfp from './media/user.png'


import { Link } from 'react-router-dom'
import  {useState, useContext } from 'react'
import { FaBars, FaTimes } from "react-icons/fa";
import  { useRef } from "react";
import { Fab } from '@mui/material'
import { AiOutlineLogout } from "react-icons/ai"
import { AuthContext } from './App'
import { initialState, reducer, State, ActionKind } from "./store/reducer"


function NavBar()
{
    const { state,  dispatch } = useContext(AuthContext);
    const navRef = React.useRef<HTMLInputElement>(null);
    const navLink = React.useRef<HTMLUListElement>(null);

    const showNavbar = () =>
    {
        navRef.current?.classList.toggle("responsive_nav");
        navLink.current?.classList.toggle("nav-list-visible")
    }

    const handleLogout = () => {
        dispatch ({
            type: ActionKind.Logout
        });
        localStorage.clear();
        window.location.pathname = "/login";
    }

    return (
        <header >
    <nav className="nav-bar" ref={navRef}>
        <div className="nav-logo">
            <img src={logo} />
        </div>
        <ul className="nav-list" ref={navLink}>
            <Link to="/main" className='navlink'>Home</Link>
            <Link to="/stats" className='navlink' >Stats</Link>
            <Link to="/chat" className='navlink'>Chat</Link>
            <Link to="/friends" className='navlink'>Friends</Link>
        </ul>
        <div className="nav-user" id="nav-user">
            <AiOutlineLogout className="logout-btn" onClick={ handleLogout}/>
            <div className="user-pfp">
                <img src={state.user.avatar} />
                
            </div>
            <p className='userName' > Welcome {state.user.login} !</p>
           
        </div>
        <button className="nav-btn nav-close-btn" onClick={() => showNavbar()}>
            <FaTimes />
        </button>
    </nav>
    <button className="nav-btn nav-open-button" onClick={() => showNavbar()}>
        <FaBars />
    </button>
        </header>
    );
}

export default NavBar;
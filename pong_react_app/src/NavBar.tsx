import React from 'react'
import './Dashboard.css'
import logo from './media/pong-logo.svg'
import user_pfp from './media/user.png'


import { Link } from 'react-router-dom'
import  {useState} from 'react'
import { FaBars, FaTimes } from "react-icons/fa";
import  { useRef } from "react";
import { Fab } from '@mui/material'

function NavBar()
{

    const navRef = React.useRef<HTMLInputElement>(null);
    const navLink = React.useRef<HTMLUListElement>(null);

    const showNavbar = () =>
    {
        navRef.current?.classList.toggle("responsive_nav");
        navLink.current?.classList.toggle("nav-list-visible")
    }

    return (
        <header >
    <nav className="nav-bar" ref={navRef}>
        <div className="nav-logo">
            <img src={logo} />
        </div>
        <ul className="nav-list" ref={navLink}>
            <Link to="/main" className='navlink'>Home</Link>
            <li className='navlink' >Stats</li>
            <Link to="/chat" className='navlink'>Chat</Link>
            <li className='navlink'>Friends</li>
        </ul>
        <div className="nav-user" id="nav-user">
            <div className="user-pfp">
                <img src={user_pfp} />
            </div>
            <p className='userName' > Welcome clmurphy !</p>
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
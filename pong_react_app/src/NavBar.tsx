import React from 'react'
import './Dashboard.css'
import logo from './media/pong-logo.svg'
import user_pfp from './media/user.png'


import { Link } from 'react-router-dom'
import  {useState} from 'react'

function NavBar()
{

    const [burgerClass, setBurgerClass] = useState("burger-bar unclicked");
    const [menu_class, setMenuClass] = useState("menu hidden");
    const [isMenuClicked, setIsMenuClicked] = useState(false);

    const updateMenu = () =>
    {
        if (!isMenuClicked)
        {
            setBurgerClass("burger-bar clicked");
            setMenuClass("menu visible");
        }
        else
        {
            setBurgerClass("burger-babr unclicked");
            setMenuClass("menu hidden");
        }
    }

    return (
    <nav className="nav-bar">
        <div className="nav-logo">
            <img src={logo} />
        </div>
        <ul className="nav-list">
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
            <div className='hamburger-menu' onClick={updateMenu}>
                <span className={burgerClass} ></span>
                <span className={burgerClass} ></span>
                <span className={burgerClass} ></span>
        </div>
    </nav>
    );
}

export default NavBar;
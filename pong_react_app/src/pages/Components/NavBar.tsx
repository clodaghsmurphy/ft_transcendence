import React from 'react'
import { useContext } from 'react'
import '../Home/Dashboard.css'
import logo from '../../media/pong-logo.svg'
import axios from 'axios';
import { AxiosError} from 'axios';
import Image from './Image';
import { Link } from 'react-router-dom'
import { FaBars, FaTimes } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai"
import { AuthContext } from '../../App'
import { ActionKind } from "../../store/reducer"


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

    const handleLogout = async() => {
        axios.post(`http://${window.location.hostname}:8080/api/auth/logout`)
        .catch((e:AxiosError) => console.log(e))
        dispatch ({
            type: ActionKind.Logout
        });
        localStorage.clear();
    }

	const params = new URLSearchParams(window.location.search)
	let home_with_id = false

	console.log(params.get('id'), window.location.pathname)

	if (window.location.pathname === '/game' && params.get('id') !== null)
		home_with_id = true
	
	console.log(home_with_id)
    return (
        <header >
    <nav className="nav-bar" ref={navRef}>
        <div className="nav-logo">
            <img src={logo} />
        </div>
        <ul className="nav-list" ref={navLink}>
            {	home_with_id ?
					<div className='navlink'
						onClick={
							() => window.location.replace(`http://${window.location.host}/game`)
						}>
							Home
						</div> :
						<Link to="/game" className='navlink'>Home</Link>
			}
            <Link to="/stats" className='navlink' >Stats</Link>
            <Link to="/chat" className='navlink'>Chat</Link>
            <li className='navlink-logout' onClick={ handleLogout}>Logout</li>
        </ul>
        <div className="nav-user" id="nav-user">
            <AiOutlineLogout className="logout-btn" onClick={ handleLogout}/>
            <Link to="/stats" className="user-pfp">
                <Image id={parseInt(state.user.id)} status={0} />
                
            </Link>
            <p className='userName' > Welcome {state.user.name} !</p>
           
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
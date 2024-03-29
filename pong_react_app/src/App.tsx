import React, {  useState, createContext, useReducer, useEffect } from 'react';
import Home from './pages/Login/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import StatsId from './pages/Stats/StatsId';
import './App.css';
import Dashboard from './pages/Home/Dashboard';
import Chat from './pages/Chat/Chat';
import Login from './pages/Login/Login';
import LoginTfa from './pages/Login/LoginTfa';
import Stats from './pages/Stats/Stats';
import Game from './pages/Game/Game';
import { initialState, reducer, State, Action } from "./store/reducer"
import ProtectedRoute from './pages/Components/ProtectedRoute'
import { ProtectedRouteProps } from './pages/Components/ProtectedRoute';
import JWTverify from './pages/Components/JWTverify';
import axios  from 'axios';
import Welcome from './pages/Stats/Welcome';

type StateContext = {
  state: State;
  dispatch: React.Dispatch<Action>
};

export const AuthContext = createContext<StateContext>( {state: initialState, dispatch: () => undefined } );


export default function App() {
	const [state, dispatch] = useReducer(reducer, initialState);
	const defaultProtectedRouteProps: Omit<ProtectedRouteProps, 'outlet'> = {
		isAuth: !!state.isLoggedIn,
		authPath: '/login',
	};

	useEffect(() => {
		const handleDisconnect = (event: BeforeUnloadEvent) => {
		//	axios.post('/api/auth/disconnect', {})
		}

		window.addEventListener('beforeunload', handleDisconnect)
		
		return () => {
			window.removeEventListener('beforeunload', handleDisconnect)
		}
	}, [state])
  
	return (
		<AuthContext.Provider value={ { state, dispatch } }>
		<Router>
			<Routes>
				<Route path="/" element={<Home />}/>
				<Route path="/login" element={<Login />}/>
				<Route path="/2fa" element={<LoginTfa />}/>
				<Route path="/game" element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Dashboard /> } /> } />
				<Route path='/chat' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Chat />} />} />
				<Route path='/welcome' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Welcome />} />} />
				<Route path='/stats' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Stats />} />} />
				<Route path='/stats/:id' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<StatsId />} />} />
		</Routes>
	<JWTverify />
	</Router>
	</AuthContext.Provider>
	);
}
import React, { useEffect } from 'react';
import Start from './Start';
import Login from './Login';
import ball from '../../media/Ball.svg';
import paddle from '../../media/Paddle.svg'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home()
{
	const [isShown, setIsShown] = useState(true);

	const navigate = useNavigate();
	const handleClick = () => {
		navigate('/login');
	}

	useEffect(() => {
		document.title = 'Pong'
	})

	return (
	<div>
		<main onClick={() => handleClick()}>
			<div className="horizon">
				<div className="paddle" id="paddle1">
					<img src={paddle} alt="paddle"/>
				</div>
				<div className="paddle" id="paddle2">
					<img src={paddle} alt="paddle"/>
				</div>
				<div className="ball">
					<img src={ball} alt="ball"/>;
				</div>
				{isShown ? <Start /> : <Login />}
			</div>
			<div className="horizon-divide"></div>
			<div className="floor"></div>

		</main>

	</div>
	)
};

export default Home
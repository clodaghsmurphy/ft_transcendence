import React from 'react';
import Start  from './Start';
import  Login from './Login'
import ball from './media/Ball.svg';
import paddle from './media/Paddle.svg'
import { useState} from 'react'
import './App.css';

function App() {
  const [isShown, setIsShown] = useState(true);

  const handleClick = () => {
    setIsShown(false);
  }
  return (
    <body>
      <main onClick={handleClick}>
        <div className="horizon">
          <div className="paddle" id="paddle1">
            <img src={paddle} />
          </div>
          <div className="paddle" id="paddle2">
            <img src={paddle} />
          </div>
          <div className="ball">
            <img src={ball} />;
          </div>
          {isShown ? <Start /> : <Login />}
        </div>
        <div className="horizon-divide"></div>
        <div className="floor"></div>

      </main>

    </body>
  );
}

export default App;

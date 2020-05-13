import React, { useState } from 'react';
import './App.css';
import Game from './components/Game';

function App() {

  // State
  const [gameID, setGameID] = useState(null);
  const [gameName, setGameName] = useState(null);
  const [rounds, setRounds] = useState(3);

  // Hole gameID vom backend
  function getGameID() {
    fetch('/game', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: gameName,
        rounds: rounds
      })
    }).then(res => res.json()).then(id => setGameID(id.GameId));
  }

  //neues spiel starten
  function newGame() {
    setGameID(null);
  }

  
  if (gameID) {
    return <Game gameID={gameID} gameName={gameName} newGame={newGame} rounds={rounds} />
  } else {
    return (
      <div className="App">
        <h1>The Numbers Game</h1>
        <p>Name:</p>
        <input type='text' placeholder='name the game' onChange={e => setGameName(e.target.value)} /><br />
        <p>Rounds:</p>
        <input type='number' value={rounds} onChange={e => setRounds(+e.target.value)} />
        <button onClick={() => { getGameID() }}>Start the Game</button>
      </div>
    );
  }
}

export default App;

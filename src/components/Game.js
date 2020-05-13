import React, { useState } from 'react';

function Game(props) {

    // https://reactjs.org/docs/hooks-state.html

    // State

    const [roundsPlayed, setRoundsPlayed] = useState(0);
    const [number, setNumber] = useState();
    const [gameWon, setGameWon] = useState(null);
    const [err, setErr] = useState('');


    function validateNumber(number) {
        if (number <= 10 && number > 0) {
            return true;
        } else {
            return false;
        }
    }


    function changeHandler(e) {
        const num = e.target.value;
        setErr('');
        setNumber(+num);
    }


    //Tip abgeben und zum backend senden

    function makeGuess(number) {
        if (!validateNumber(number)) {
            return setErr('Enter a valid number');
        }

        fetch(`/game/${props.gameID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Value: number }),
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Tipp konnte nicht abgegeben werden');
                }
            })
            .then(answer => setGameWon(answer.Status))
            .catch((error) => {
                console.log('Oh Nein ' + error);
            });
    }

    // Status vom backend abfragen

    function getStatus() {

        fetch(`/game/${props.gameID}/status`, {
            method: 'POST'
        })
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    throw new Error('Status konnte nicht geladen werden');
                }
            })
            .then(status => setRoundsPlayed(status.PlayCounter))
            .catch((error) => {
                console.log('Oh Nein ' + error);
            });
    }



    return (
        <div className='App'>
            <h1>{props.gameName}</h1>
            <p>Enter a number between 1 and 10</p>
            {roundsPlayed < props.rounds - 1 && !gameWon ? <h2>You have {props.rounds - roundsPlayed} tries left</h2> : ''}
            {roundsPlayed === props.rounds - 1 && !gameWon ? <h2 className='danger'>Last try</h2> : ''}
            {!gameWon && roundsPlayed < props.rounds && roundsPlayed > 0 ? <p>No sorry try again</p> : ''}
            {gameWon === true ? <h2 className='green'>Correct you Win</h2> : ''}
            {!gameWon && roundsPlayed === props.rounds ? <h2 className='danger'>Game Over</h2> : ''}
            <input type='number' min='1' max='10' onChange={changeHandler} /><br />
            {err}
            {!gameWon && roundsPlayed < props.rounds ? <button onClick={() => { makeGuess(number); getStatus() }}>Make guess</button> : <button onClick={props.newGame}>New Game</button>}
        </div>
    );



}

export default Game;
import Chessboard from 'chessboardjsx';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';
import ChessFirestore from "./ChessFirebase";
import * as ChessJS from "chess.js";


function Game() {

const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

const location = useLocation();
const [player, setPlayer] = useState<string>();
const [chess, setChess] = useState<any>();

console.log("My chess board: ", chess);

useMemo(() => {
    if (location) {
        const pathName = location.pathname;
        const parts = pathName.split('/');
        if (parts.length === 3) { // Expected url
            const gameId = parts[1];
            const player = parts[2];
            setPlayer(player);

            const ref = ChessFirestore.database().ref(`games/${gameId}`);

            // Attach an asynchronous callback to read the data at our posts reference
            ref.on('value', (snapshot) => {
                setChess(new Chess(snapshot.val()?.chess)); // Listen for updates to chess board
            }, (errorObject) => {
            console.log('The read failed: ' + errorObject.name);
            }); 
        }
    }
}, [location]);

useEffect(() => {
    if (chess) {
        console.log('moves: ', chess.moves());
    }
}, [chess]);


console.log(location.pathname);

  return (
    <div>
      <Chessboard position="start"/>
    </div>
  );
}

export default Game;

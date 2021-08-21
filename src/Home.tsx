import { useHistory } from "react-router-dom";
import "./App.css";
import { uid } from 'rand-token';
import ChessFirestore from "./ChessFirebase";
import * as ChessJS from "chess.js";
import { useEffect } from "react";

function Home() {
  const history = useHistory();

  const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

  return (
    <div>
      <button
        onClick={() => {
          const newGame = {
            p1_token: uid(12),
            p2_token: uid(12),
            // string of current position (can have chess board constructed from this)
            chess: new Chess().fen()
          };
          const game = ChessFirestore.database().ref("games").push();
          game.set(newGame);
          history.push(`/${game.key}/${newGame.p1_token}`);
        }}
        style={{
          position: "fixed" /* or absolute */,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "black",
          color: "white",
          padding: "40px",
          fontSize: "30px",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Create a game
      </button>
    </div>
  );
}

export default Home;

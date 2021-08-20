import { useHistory } from "react-router-dom";
import "./App.css";
import { uid } from 'rand-token';
import ChessFirestore from "./ChessFirebase";
import { useEffect } from "react";

function Home({ setGame }: { setGame: (game: any) => void }) {
  const history = useHistory();


  return (
    <div>
      <button
        onClick={() => {
            // TODO: make sure these are not the same
          const newGame = {
            p1_token: uid(12),
            p2_token: uid(12),
          };
          const game = ChessFirestore.database().ref("games").push();
          game.set(newGame);
          setGame(newGame);
          history.push(`/${game.key}/${newGame.p1_token}`);
        }}
        style={{
          position: "fixed" /* or absolute */,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        Create a game
      </button>
    </div>
  );
}

export default Home;

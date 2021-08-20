import { useHistory } from "react-router-dom";
import "./App.css";
import { uid } from 'rand-token';
import ChessFirestore from "./ChessFirebase";

function Home({ setGame }: { setGame: (game: any) => void }) {
  const history = useHistory();

  return (
    <div>
      <button
        onClick={() => {
          const newGame = {
            p1_token: uid(12),
            p2_token: uid(12),
          };
          console.log(newGame);
          //const game = firebase.database().ref("games").push();
          const game = ChessFirestore.database().ref("games").push();
          game.set(newGame);
          setGame(newGame);
          history.push(`/${newGame.p1_token}`);
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

import Chessboard from "chessboardjsx";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import "./App.css";
import ChessFirestore from "./ChessFirebase";
import * as ChessJS from "chess.js";
import firebase from "firebase";

function Square(white: boolean) {
  return (
    <div
      style={{
        display: "inline-block",
        width: "20px",
        height: "20px",
        background: white ? "white" : "black",
        border: "2px solid black"
      }}
    />

  );
}

function Game() {
  const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

  const location = useLocation();
  const [player, setPlayer] = useState<string>();
  const [chess, setChess] = useState<any>();
  const [chessFen, setChessFen] = useState<string>();
  const [gameData, setGameData] = useState<any>();
  const [firebaseRef, setFirebaseRef] = useState<firebase.database.Reference>();
  const [isOurTurn, setIsOurTurn] = useState<boolean>(false);
  const [isCheckMate, setIsCheckmate] = useState<boolean>(false);
  const [isCheck, setIsCheck] = useState<boolean>(false);
  const [isStalemate, setIsStalemate] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameId, setGameId] = useState<string>("");
  const [p2, setP2] = useState<string>("");

  const isWhite = player === gameData?.p1_token;
  const currentTurn = chess && chess.turn();

  // Update the fen in response to board updates
  useEffect(() => {
    if (chess) {
      setChessFen(chess.fen());
      setIsCheck(chess.in_check());
      setIsCheckmate(chess.in_checkmate());
      setIsStalemate(chess.in_stalemate());
      setIsGameOver(chess.game_over());
    }
  }, [chess]);

  // Get the firebase ref based on url
  useMemo(() => {
    if (location) {
      const pathName = location.pathname;
      const parts = pathName.split("/");
      if (parts.length === 3) {
        // Expected url
        const gameId = parts[1];
        setGameId(gameId);
        const player = parts[2];
        setPlayer(player);

        const ref = ChessFirestore.database().ref(`games/${gameId}`);
        setFirebaseRef(ref);

        // Attach an asynchronous callback to read the data at our posts reference
        ref.on(
          "value",
          (snapshot) => {
            setGameData(snapshot.val());
            setP2(snapshot.val()?.p2_token);
            setChess(new Chess(snapshot.val()?.chess)); // Listen for updates to chess board
          },
          (errorObject) => {
            console.log("The read failed: " + errorObject.name);
          }
        );
      }
    }
  }, [location]);

  // Check if it's our turn
  useEffect(() => {
    const ourTurn =
      chess &&
      ((isWhite == true && currentTurn === "w") ||
        (isWhite == false && currentTurn === "b"));
    setIsOurTurn(ourTurn);
  }, [isWhite, currentTurn, chess]);

  function handleDrop({
    sourceSquare,
    targetSquare,
    piece,
  }: {
    sourceSquare: any;
    targetSquare: any;
    piece: any;
  }) {
    if (isOurTurn) {
      const pieceType = piece.substring(1, 2); // don't need color
      const moves: any[] = chess.moves({ verbose: true });
      const move = moves.find(
        (move: any) =>
          move.to === targetSquare &&
          move.from === sourceSquare &&
          move.piece.toLowerCase() === pieceType.toLowerCase()
      );

      if (move) {
        // valid move
        console.log("valid move");
        chess.move(move);

        let updatedFen = chess.fen();

        const updates: any = {};
        updates["chess"] = updatedFen;
        firebaseRef && firebaseRef.update(updates);
        setChessFen(updatedFen); // Updates our board
      }
    }
  }

  return (
    <div>
        <div className="split left">
          <div style={{marginLeft: "10%", marginTop: "5%"}}>
            {chess && (
              <Chessboard
                orientation={isWhite ? "white" : "black"}
                onDrop={handleDrop}
                position={chessFen}
              />
            )}
          </div>
        </div>
        <div className="split right">
          <div className="centered">
            {currentTurn === "w" && <h1>Turn: {Square(true)} </h1>}
            {currentTurn === "b" && <h1>Turn: {Square(false)}</h1>}
            {isCheck && <h1> Check </h1>}
            {isCheckMate && (
              <h1>
                {" "}
                Checkmate, Winner: {chess.turn() === "w"
                  ? Square(false)
                  : Square(true)}{" "}
              </h1>
            )}
            {isStalemate && (
              <h1>
                {" "}
                Stalemate, Winner: {chess.turn() === "w"
                  ? Square(false)
                  : Square(true)}{" "}
              </h1>
            )}
            {isWhite && <a href={`localhost:3000/${gameId}/${p2}`}>Invite link</a>}
          </div>
        </div>
    </div>
  );
}

export default Game;

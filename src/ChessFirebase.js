import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBvgwaLE38Ku0rhZloTDhi8yjQ7edIIYc0",
    authDomain: "chess-21cc8.firebaseapp.com",
    databaseURL: "https://chess-21cc8-default-rtdb.firebaseio.com",
    projectId: "chess-21cc8",
    storageBucket: "chess-21cc8.appspot.com",
    messagingSenderId: "841924063794",
    appId: "1:841924063794:web:216d8246f6e75aaa23c22b",
    measurementId: "G-HWDD2EPDHM"
  };

const ChessFirestore = firebase.initializeApp(firebaseConfig);
export default ChessFirestore;
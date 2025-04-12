// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "incidencias-academicas.firebaseapp.com",
  databaseURL: "https://incidencias-academicas-default-rtdb.firebaseio.com",
  projectId: "incidencias-academicas",
  storageBucket: "incidencias-academicas.appspot.com",
  messagingSenderId: "85099390146",
  appId: "1:85099390146:web:458fe6fe105cdbb672475b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export {db};
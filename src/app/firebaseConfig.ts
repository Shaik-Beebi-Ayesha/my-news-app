// Import the functions you need from the SDKs you need
// import firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDsQuwUMCeueJSprD0Yf85ICXh9HsEQki0",
  authDomain: "newsapp-ea505.firebaseapp.com",
  projectId: "newsapp-ea505",
  storageBucket: "newsapp-ea505.appspot.com",
  messagingSenderId: "351790619441",
  appId: "1:351790619441:web:368acc38ce015469d16e10",
  measurementId: "G-LS3NHMY5GX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);



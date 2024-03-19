// src/services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import the authentication module

const firebaseConfig = {
  apiKey: "AIzaSyDG_zCv2vlbPgPR9-Sih93Oejqnw9wBwSo",
  authDomain: "sigtrackweb.firebaseapp.com",
  projectId: "sigtrackweb",
  storageBucket: "sigtrackweb.appspot.com",
  messagingSenderId: "253377488323",
  appId: "1:253377488323:web:97405a14d27d51efae0976"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, firebaseConfig, db, auth };

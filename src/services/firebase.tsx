// src/services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import the authentication module
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDkH3rGQ0UoH2a_fNFO7HaP2oOpazyH7rU",
  authDomain: "fieldcom-8159b.firebaseapp.com",
  projectId: "fieldcom-8159b",
  storageBucket: "fieldcom-8159b.appspot.com",
  messagingSenderId: "548978360911",
  appId: "1:548978360911:web:ce8e6102b0543beedc203a",
  measurementId: "G-GFP3QED5E7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, firebaseConfig, db, auth,storage };

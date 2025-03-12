import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7NLE_JsVAeLQJ9ebBGkl7wrKRgpCXT0E",
  authDomain: "eventease-550b2.firebaseapp.com",
  projectId: "eventease-550b2",
  storageBucket: "eventease-550b2.appspot.com",
  messagingSenderId: "547402221261",
  appId: "1:547402221261:web:867c47d2f125fcdd8ccb84",
  measurementId: "G-W76565CM2F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, getDocs, query, where, doc, updateDoc, deleteDoc, onSnapshot };

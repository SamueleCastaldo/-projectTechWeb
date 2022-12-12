// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, FacebookAuthProvider, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDk8F1-wWZ-GBJFvQPaRguRamhUdvhlb4I",
    authDomain: "progtec-274d8.firebaseapp.com",
    projectId: "progtec-274d8",
    storageBucket: "progtec-274d8.appspot.com",
    messagingSenderId: "903975459163",
    appId: "1:903975459163:web:97ef001dba022effcea27e"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//references
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app)
export const providerGoogle = new GoogleAuthProvider();
export const providerFacebook = new FacebookAuthProvider();


export function signup(email, password) {
  return  createUserWithEmailAndPassword(auth, email, password);
}

export function login(email, password) {
  return  signInWithEmailAndPassword(auth, email, password);
}

export function forgotPassword(email) {
  return sendPasswordResetEmail(auth, email);
}
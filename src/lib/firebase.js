// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_6Z7MJWyYApzIUopA1fQC3p-MtMIVDew",
  authDomain: "uday-8d466.firebaseapp.com",
  projectId: "uday-8d466",
  storageBucket: "uday-8d466.firebasestorage.app",
  messagingSenderId: "977380866864",
  appId: "1:977380866864:web:7e9b92f0c81e45f91ca6f5",
  measurementId: "G-S3VJ9PHT2P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
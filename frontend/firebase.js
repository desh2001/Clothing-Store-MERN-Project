// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDob9TT8YMc1ZGxfJbykcGEDFKaBu2pFzA",
  authDomain: "clothing-store-9ee75.firebaseapp.com",
  projectId: "clothing-store-9ee75",
  storageBucket: "clothing-store-9ee75.firebasestorage.app",
  messagingSenderId: "941181877318",
  appId: "1:941181877318:web:90bf4939c6eb664805de47",
  measurementId: "G-F145T6GF2C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
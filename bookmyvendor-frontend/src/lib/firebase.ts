import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB4ZTInzOwHcfFzmJuGmt2HsBDXGaZ57WY",
  authDomain: "bookmyvendor-cca78.firebaseapp.com",
  projectId: "bookmyvendor-cca78",
  storageBucket: "bookmyvendor-cca78.firebasestorage.app",
  messagingSenderId: "576090013382",
  appId: "1:576090013382:web:609ebccbb284a901ca61c7",
  measurementId: "G-42PH25LKPE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

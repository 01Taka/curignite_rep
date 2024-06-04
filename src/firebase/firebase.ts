import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBChm9rimvWhOyp8eTVWjrS0OEoynAU29M",
    authDomain: "curignite-33bbc.firebaseapp.com",
    projectId: "curignite-33bbc",
    storageBucket: "curignite-33bbc.appspot.com",
    messagingSenderId: "229415722426",
    appId: "1:229415722426:web:b6018752da9041366cd183",
    measurementId: "G-VM822B0ETV"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
export { db, auth, googleProvider };
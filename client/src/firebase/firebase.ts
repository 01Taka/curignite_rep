import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { enableIndexedDbPersistence, getFirestore, initializeFirestore, persistentLocalCache } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getMessaging } from 'firebase/messaging';
// import { requestNotificationPermission } from "../functions/firebase/initialize";
import { firebaseConfig } from "./firebaseConfig";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const messaging = getMessaging(app);

const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider, storage, messaging };
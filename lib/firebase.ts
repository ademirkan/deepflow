import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import {
    createUserWithEmailAndPassword,
    getAuth,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAdG7aoyRF8NYSjALFf0Ujj5qOgyjRqBOM",
    authDomain: "deepflow-6575a.firebaseapp.com",
    projectId: "deepflow-6575a",
    storageBucket: "deepflow-6575a.firebasestorage.app",
    messagingSenderId: "1046783084121",
    appId: "1:1046783084121:web:f69f5fd95afd363c20d348",
    measurementId: "G-K7F0K7HTG1",
};

// Initialize Firebase app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export Firebase services
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); // Google Auth Provider
export {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
};
export default app;

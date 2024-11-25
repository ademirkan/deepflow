import {
    auth,
    createUserWithEmailAndPassword,
    googleProvider,
    signInWithEmailAndPassword,
    signOut,
} from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { getErrorMessage } from "./errorService";

// Sign in a user
export const signIn = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        return userCredential.user;
    } catch (error) {
        // Use the error service to get a user-friendly message
        const errorMessage = getErrorMessage(error);
        throw new Error(errorMessage);
    }
};

// Sign up a user
export const signUp = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        return userCredential.user;
    } catch (error) {
        // Use the error service to get a user-friendly message
        const errorMessage = getErrorMessage(error);
        throw new Error(errorMessage);
    }
};

// Sign out the current user
export const logOut = async () => {
    return signOut(auth);
};

export const googleSignIn = async () => {
    try {
        const userCredential = await signInWithPopup(auth, googleProvider);
        return userCredential.user;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        throw new Error(errorMessage);
    }
};

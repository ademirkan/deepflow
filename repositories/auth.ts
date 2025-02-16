import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    signInWithPopup,
    onAuthStateChanged,
    User as FirebaseUser,
    signInAnonymously,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export class FirebaseAuthRepository {
    signIn(email: string, password: string) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    signUp(email: string, password: string) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    signOut() {
        return signOut(auth);
    }

    signInWithGoogle() {
        return signInWithPopup(auth, googleProvider);
    }

    getCurrentUser() {
        return auth.currentUser;
    }

    onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
        return onAuthStateChanged(auth, callback);
    }

    signInAnonymously() {
        return signInAnonymously(auth);
    }
}

import { create } from "zustand";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    User as FirebaseUser,
    signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { User, AuthResponse, AuthStatus } from "@/types/userTypes";

interface AuthState {
    user: User | null;
    accessToken: string | null;
    loading: boolean;
    logIn: (email: string, password: string) => Promise<AuthResponse>;
    signUp: (email: string, password: string) => Promise<AuthResponse>;
    logOut: () => Promise<void>;
    getAuthState: () => AuthStatus;
    logInWithGoogle: () => Promise<AuthResponse>;
}

const useAuthStore = create<AuthState>((set) => {
    const mapFirebaseUser = (fbUser: FirebaseUser): User => ({
        uid: fbUser.uid,
        email: fbUser.email,
        name: fbUser.displayName,
        image: fbUser.photoURL,
    });

    const logIn = async (
        email: string,
        password: string
    ): Promise<AuthResponse> => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const token = await result.user.getIdToken();
        set({ accessToken: token, user: mapFirebaseUser(result.user) });
        return {
            user: mapFirebaseUser(result.user),
            accessToken: token,
        };
    };

    const signUp = async (
        email: string,
        password: string
    ): Promise<AuthResponse> => {
        const result = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const token = await result.user.getIdToken();
        set({ accessToken: token, user: mapFirebaseUser(result.user) });
        return {
            user: mapFirebaseUser(result.user),
            accessToken: token,
        };
    };

    const logOut = async (): Promise<void> => {
        await signOut(auth);
        set({ accessToken: null, user: null });
    };

    const getAuthState = (): AuthStatus => {
        return auth.currentUser ? "authenticated" : "unauthenticated";
    };

    const logInWithGoogle = async (): Promise<AuthResponse> => {
        const result = await signInWithPopup(auth, googleProvider);
        const token = await result.user.getIdToken();
        set({ accessToken: token, user: mapFirebaseUser(result.user) });
        return {
            user: mapFirebaseUser(result.user),
            accessToken: token,
        };
    };

    onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            const token = await firebaseUser.getIdToken();
            set({
                user: mapFirebaseUser(firebaseUser),
                accessToken: token,
                loading: false,
            });
        } else {
            set({ user: null, accessToken: null, loading: false });
        }
    });

    return {
        user: null,
        accessToken: null,
        loading: true,
        logIn,
        signUp,
        logOut,
        getAuthState,
        logInWithGoogle,
    };
});

export default useAuthStore;

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    loading: boolean;
    logIn: (email: string, password: string) => Promise<AuthResponse>;
    signUp: (email: string, password: string) => Promise<AuthResponse>;
    logOut: () => Promise<void>;
    getAuthState: () => AuthStatus;
    logInWithGoogle: () => Promise<AuthResponse>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

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
        setAccessToken(token);
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
        setAccessToken(token);
        return {
            user: mapFirebaseUser(result.user),
            accessToken: token,
        };
    };

    const logOut = async (): Promise<void> => {
        await signOut(auth);
        setAccessToken(null);
    };

    const getAuthState = (): AuthStatus => {
        return auth.currentUser ? "authenticated" : "unauthenticated";
    };

    const logInWithGoogle = async (): Promise<AuthResponse> => {
        const result = await signInWithPopup(auth, googleProvider);
        const token = await result.user.getIdToken();
        setAccessToken(token);
        return {
            user: mapFirebaseUser(result.user),
            accessToken: token,
        };
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(mapFirebaseUser(firebaseUser));
                const token = await firebaseUser.getIdToken();
                setAccessToken(token);
            } else {
                setUser(null);
                setAccessToken(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                loading,
                logIn,
                signUp,
                logOut,
                getAuthState,
                logInWithGoogle,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

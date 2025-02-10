import { create } from "zustand";
import authService from "@/service/authService";
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
    // Subscribe to Firebase auth state changes via the authService.
    authService.onAuthStateChanged(async (user) => {
        if (user) {
            // Optionally, if you want to store an access token here you could re-fetch it if needed.
            set({ user, accessToken: null, loading: false });
        } else {
            set({ user: null, accessToken: null, loading: false });
        }
    });

    return {
        user: null,
        accessToken: null,
        loading: true,
        logIn: async (email: string, password: string) => {
            const response = await authService.logIn(email, password);
            set({ user: response.user, accessToken: response.accessToken });
            return response;
        },
        signUp: async (email: string, password: string) => {
            const response = await authService.signUp(email, password);
            set({ user: response.user, accessToken: response.accessToken });
            return response;
        },
        logOut: async () => {
            await authService.logOut();
            set({ user: null, accessToken: null });
        },
        getAuthState: () => authService.getAuthState(),
        logInWithGoogle: async () => {
            const response = await authService.logInWithGoogle();
            set({ user: response.user, accessToken: response.accessToken });
            return response;
        },
    };
});

export default useAuthStore;

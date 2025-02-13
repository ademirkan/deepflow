import { create } from "zustand";
import authService from "@/service/auth";
import { User, AuthResponse, AuthStatus } from "@/types/user";

interface AuthState {
    user: User | null;
    loading: boolean;
}

interface AuthActions {
    logIn: (email: string, password: string) => Promise<AuthResponse>;
    signUp: (email: string, password: string) => Promise<AuthResponse>;
    logOut: () => Promise<void>;
    getAuthState: () => AuthStatus;
    logInWithGoogle: () => Promise<AuthResponse>;
}

type AuthStore = AuthState & AuthActions;

const useAuthStore = create<AuthStore>((set) => {
    authService.onAuthStateChanged(async (user) => {
        if (user) {
            set({ user, loading: false });
        } else {
            set({ user: null, loading: false });
        }
    });

    return {
        user: null,
        loading: true,
        logIn: async (email: string, password: string) => {
            const response = await authService.logIn(email, password);
            set({ user: response.user, loading: false });
            return response;
        },
        signUp: async (email: string, password: string) => {
            const response = await authService.signUp(email, password);
            set({ user: response.user, loading: false });
            return response;
        },
        logOut: async () => {
            await authService.logOut();
            set({ user: null, loading: false });
        },
        getAuthState: () => authService.getAuthState(),
        logInWithGoogle: async () => {
            const response = await authService.logInWithGoogle();
            set({ user: response.user, loading: false });
            return response;
        },
    };
});

export default useAuthStore;

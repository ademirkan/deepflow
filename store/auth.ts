import { create } from "zustand";
import authService from "@/service/auth";
import { User, AuthResponse, AuthStatus } from "@/types/user";
import { persist } from "zustand/middleware";
import { AUTH_STORAGE_KEY } from "@/constants/keys";
interface AuthState {
    user: User | null;
    loading: boolean;
}

interface AuthActions {
    logIn: (email: string, password: string) => Promise<AuthResponse>;
    signUp: (email: string, password: string) => Promise<AuthResponse>;
    logOut: () => Promise<AuthResponse>;
    getAuthState: () => AuthStatus;
    logInWithGoogle: () => Promise<AuthResponse>;
}

type AuthStore = AuthState & AuthActions;

const useAuthStore = create<AuthStore>()(
    persist(
        (set) => {
            authService.onAuthStateChanged((user) => {
                if (user) {
                    set({ user, loading: false });
                } else {
                    set({ user: null, loading: true });
                    authService.signInAnonymously().then((response) => {
                        set({ user: response.user, loading: false });
                    });
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
                    const response = await authService.logOut();
                    set({ user: response.user, loading: false });
                    return response;
                },
                getAuthState: () => authService.getAuthState(),
                logInWithGoogle: async () => {
                    const response = await authService.logInWithGoogle();
                    set({ user: response.user, loading: false });
                    return response;
                },
            };
        },
        {
            name: AUTH_STORAGE_KEY,
        }
    )
);

export default useAuthStore;

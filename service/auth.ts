import { FirebaseAuthRepository } from "@/repositories/auth";
import { User, AuthResponse, AuthStatus } from "@/types/user";

class AuthService {
    private authRepo = new FirebaseAuthRepository();

    // Maps a Firebase user to your internal user model.
    private mapFirebaseUser(fbUser: any): User {
        return {
            uid: fbUser.uid,
            email: fbUser.email,
            name: fbUser.displayName,
            image: fbUser.photoURL,
            isAnonymous: fbUser.isAnonymous,
        };
    }

    async logIn(email: string, password: string): Promise<AuthResponse> {
        const result = await this.authRepo.signIn(email, password);
        return {
            user: this.mapFirebaseUser(result.user),
        };
    }

    async signUp(email: string, password: string): Promise<AuthResponse> {
        const result = await this.authRepo.signUp(email, password);
        return {
            user: this.mapFirebaseUser(result.user),
        };
    }

    async signInAnonymously(): Promise<AuthResponse> {
        const result = await this.authRepo.signInAnonymously();
        return {
            user: this.mapFirebaseUser(result.user),
        };
    }

    /**
     * Signs the user out.
     * This method is now decoupled from signing in anonymously.
     */
    async logOut(): Promise<AuthResponse> {
        await this.authRepo.signOut();
        return {
            user: null,
        };
    }

    /**
     * Returns the current auth status.
     * If there is no user, we consider the state "unauthenticated".
     * If the current user is anonymous, we consider the user a "guest".
     */
    getAuthState(): AuthStatus {
        const fbUser = this.authRepo.getCurrentUser();
        if (!fbUser) {
            return "loading";
        }

        return fbUser.isAnonymous ? "guest" : "authenticated";
    }

    async logInWithGoogle(): Promise<AuthResponse> {
        const result = await this.authRepo.signInWithGoogle();
        return {
            user: this.mapFirebaseUser(result.user),
        };
    }

    /**
     * Provides a callback-based listener for auth state changes.
     * If there is no active Firebase user, for example after a sign-out,
     * the callback will be triggered with null.
     */
    onAuthStateChanged(callback: (user: User | null) => void) {
        return this.authRepo.onAuthStateChanged((firebaseUser) => {
            if (!firebaseUser) {
                callback(null);
            } else {
                callback(this.mapFirebaseUser(firebaseUser));
            }
        });
    }
}

const authService = new AuthService();
export default authService;

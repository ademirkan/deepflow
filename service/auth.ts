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

    async logOut(): Promise<void> {
        await this.authRepo.signOut();
    }

    getAuthState(): AuthStatus {
        return this.authRepo.getCurrentUser()
            ? "authenticated"
            : "unauthenticated";
    }

    async logInWithGoogle(): Promise<AuthResponse> {
        const result = await this.authRepo.signInWithGoogle();
        return {
            user: this.mapFirebaseUser(result.user),
        };
    }

    // This method provides a callback-based listener for auth state changes.
    onAuthStateChanged(callback: (user: User | null) => void) {
        return this.authRepo.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                callback(this.mapFirebaseUser(firebaseUser));
            } else {
                callback(null);
            }
        });
    }
}

const authService = new AuthService();
export default authService;

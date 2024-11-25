// errorService.ts
import { FirebaseError } from "firebase/app";

export const getErrorMessage = (error: unknown): string => {
    if (error instanceof FirebaseError) {
        switch (error.code) {
            case "auth/email-already-in-use":
                return "This email is already in use. Please use a different email.";
            case "auth/invalid-email":
                return "The email address is invalid. Please check and try again.";
            case "auth/wrong-password":
                return "Incorrect password. Please try again.";
            case "auth/user-not-found":
                return "No account found with this email.";
            default:
                return "An unknown error occurred. Please try again later.";
        }
    }

    // Handle non-Firebase errors or unexpected cases
    return "An unexpected error occurred. Please try again.";
};

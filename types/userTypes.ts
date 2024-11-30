export type User = {
    uid: string; // Unique identifier (Firebase UID or NextAuth user ID)
    email: string | null; // User's email address
    name: string | null; // User's display name
    image?: string | null; // URL to the profile picture
};

export type AuthResponse = {
    user: User | null; // Authenticated user details
    accessToken?: string; // Optional access token (if needed)
};

export type AuthStatus = "authenticated" | "unauthenticated" | "loading";

export type User = {
    uid: string; // Unique identifier (Firebase UID or NextAuth user ID)
    email: string | null; // User's email address
    name: string | null; // User's display name
    image?: string | null; // URL to the profile picture
    isAnonymous?: boolean; // true if the user is authenticated anonymously (guest)
};

export type AuthResponse = {
    user: User | null; // Authenticated user details
};

export type AuthStatus = "authenticated" | "guest" | "loading";

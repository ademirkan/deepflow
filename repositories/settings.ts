import { Settings } from "@/types/settings";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";

export interface SettingsRepositoryInterface {
    // Creates a new settings document (completely overwritten)
    create(uid: string, settings: Settings): Promise<Settings>;
    // Reads the settings document for the user
    read(uid: string): Promise<Settings>;
    // Applies a patch update to only the provided fields using updateDoc
    // update(preferences: Partial<Preferences>): Promise<Preferences>;
    // Updates a specific preference field using dot notation (for nested updates)
    // updateField(fieldPath: string, value: any): Promise<Preferences>;
    // Fully rewrites the settings document (no merging)
    set(uid: string, settings: Settings): Promise<Settings>;
    // Deletes the settings document (if desired)
    delete(uid: string): Promise<void>;
}

export class FirebaseSettingsRepository implements SettingsRepositoryInterface {
    async create(uid: string, settings: Settings): Promise<Settings> {
        if (!uid) {
            throw new Error("User not authenticated");
        }
        const docRef = doc(db, "settings", uid);
        // Using setDoc without merge will create a new document or overwrite an existing one.
        await setDoc(docRef, settings, { merge: false });
        return settings;
    }

    async read(uid: string): Promise<Settings> {
        if (!uid) {
            throw new Error("User not authenticated");
        }
        const docRef = doc(db, "settings", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as Settings;
        } else {
            throw new Error("Settings document not found");
        }
    }

    async set(uid: string, settings: Settings): Promise<Settings> {
        if (!uid) {
            throw new Error("User not authenticated");
        }
        const docRef = doc(db, "settings", uid);
        // This completely rewrites the document without merging existing data.
        await setDoc(docRef, settings, { merge: false });
        return settings;
    }

    async delete(uid: string): Promise<void> {
        if (!uid) {
            throw new Error("User not authenticated");
        }
        const docRef = doc(db, "settings", uid);
        await deleteDoc(docRef);
    }
}

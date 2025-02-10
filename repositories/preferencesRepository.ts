import { Preferences } from "@/types/preferenceTypes";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";

export interface PreferencesRepositoryInterface {
    // Creates a new preferences document (completely overwritten)
    create(uid: string, preferences: Preferences): Promise<Preferences>;
    // Reads the preferences document for the user
    read(uid: string): Promise<Preferences>;
    // Applies a patch update to only the provided fields using updateDoc
    // update(preferences: Partial<Preferences>): Promise<Preferences>;
    // Updates a specific preference field using dot notation (for nested updates)
    // updateField(fieldPath: string, value: any): Promise<Preferences>;
    // Fully rewrites the preferences document (no merging)
    set(uid: string, preferences: Preferences): Promise<Preferences>;
    // Deletes the preferences document (if desired)
    delete(uid: string): Promise<void>;
}

export class FirebasePreferencesRepository
    implements PreferencesRepositoryInterface
{
    async create(uid: string, preferences: Preferences): Promise<Preferences> {
        if (!uid) {
            throw new Error("User not authenticated");
        }
        const docRef = doc(db, "preferences", uid);
        // Using setDoc without merge will create a new document or overwrite an existing one.
        await setDoc(docRef, preferences, { merge: false });
        return preferences;
    }

    async read(uid: string): Promise<Preferences> {
        if (!uid) {
            throw new Error("User not authenticated");
        }
        const docRef = doc(db, "preferences", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as Preferences;
        } else {
            throw new Error("Preferences document not found");
        }
    }

    async set(uid: string, preferences: Preferences): Promise<Preferences> {
        if (!uid) {
            throw new Error("User not authenticated");
        }
        const docRef = doc(db, "preferences", uid);
        // This completely rewrites the document without merging existing data.
        await setDoc(docRef, preferences, { merge: false });
        return preferences;
    }

    async delete(uid: string): Promise<void> {
        if (!uid) {
            throw new Error("User not authenticated");
        }
        const docRef = doc(db, "preferences", uid);
        await deleteDoc(docRef);
    }
}

import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Fetch documents from a collection with a specific condition.
 *
 * @param collectionName - The name of the Firestore collection.
 * @param field - The field to filter by.
 * @param value - The value to filter for.
 * @returns A promise that resolves to an array of documents with their ID and data.
 */
export const fetchCollectionWithFilter = async <T>(
    collectionName: string,
    field: string,
    value: any
): Promise<(T & { id: string })[]> => {
    const q = query(collection(db, collectionName), where(field, "==", value));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as unknown as T),
    }));
};

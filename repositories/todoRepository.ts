import { fetchCollectionWithFilter } from "@/lib/firebaseUtils";
import { auth, db } from "@/lib/firebase";
import { Todo } from "@/types/todoTypes";
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    getDoc,
    serverTimestamp,
} from "firebase/firestore";

interface TodoRepositoryInterface {
    create(item: string, userId?: string): Promise<Todo>;
    readAll(userId?: string): Promise<Todo[]>;
    readById(id: string, userId?: string): Promise<Todo>;
    update(
        item: Partial<Todo> & Pick<Todo, "id">,
        userId?: string
    ): Promise<Partial<Todo>>;
    delete(id: string, userId?: string): Promise<void>;
}

export class FirebaseTodoRepository implements TodoRepositoryInterface {
    async create(item: string): Promise<Todo> {
        const uid = auth.currentUser?.uid;
        if (!uid) {
            throw new Error("User not authenticated");
        }

        const todosCollection = collection(db, "todos");
        const docRef = await addDoc(todosCollection, {
            text: item,
            completed: false,
            uid: uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        return {
            id: docRef.id,
            text: item,
            completed: false,
            uid: uid,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }

    async readAll(): Promise<Todo[]> {
        const uid = auth.currentUser?.uid;
        return fetchCollectionWithFilter<Todo>("todos", "uid", uid);
    }

    async readById(id: string): Promise<Todo> {
        const todoDoc = doc(db, "todos", id);
        if (!todoDoc) {
            return Promise.reject("Todo not found");
        }
        const todoSnap = await getDoc(todoDoc);
        if (!todoSnap.exists()) {
            return Promise.reject("Todo not found");
        }
        const data = todoSnap.data();

        return {
            id: todoSnap.id,
            text: data.text,
            completed: data.completed,
            uid: data.uid,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
        } as Todo;
    }

    async update(
        item: Partial<Todo> & Pick<Todo, "id">
    ): Promise<Partial<Todo> & Pick<Todo, "id" | "updatedAt">> {
        const todoDoc = doc(db, "todos", item.id);
        if (!todoDoc) {
            return Promise.reject("Todo not found");
        }

        const { id, ...updateData } = item;

        await updateDoc(todoDoc, {
            ...updateData,
            updatedAt: serverTimestamp(),
        });

        return {
            id,
            ...updateData,
            updatedAt: new Date(),
        };
    }

    async delete(id: string): Promise<void> {
        const todoDoc = doc(db, "todos", id);
        await deleteDoc(todoDoc);
    }
}

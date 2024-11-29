import { fetchCollectionWithFilter } from "@/lib/firebaseUtils";
import { auth, db } from "@/lib/firebase";
import { Todo } from "@/types/todoTypes";
import { TodoRepository } from "@/types/todoTypes";
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
} from "firebase/firestore";

export class FirebaseTodoRepository implements TodoRepository {
    async add(text: string): Promise<Todo> {
        const uid = auth.currentUser?.uid;
        const newTodo: Omit<Todo, "id"> = {
            text: text,
            completed: false,
            uid: uid as string,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const todosCollection = collection(db, "todos");
        const docRef = await addDoc(todosCollection, newTodo);

        return {
            id: docRef.id,
            ...newTodo,
        };
    }

    async getAll(): Promise<Todo[]> {
        const uid = auth.currentUser?.uid;
        return fetchCollectionWithFilter<Todo>("todos", "uid", uid);
    }

    async updateCompletion(id: string, completed: boolean): Promise<void> {
        const todoDoc = doc(db, "todos", id);
        if (!todoDoc) {
            return Promise.reject("Todo not found");
        }
        await updateDoc(todoDoc, {
            completed,
            updatedAt: new Date(),
        });
    }

    async delete(id: string): Promise<void> {
        const todoDoc = doc(db, "todos", id);
        await deleteDoc(todoDoc);
    }
}

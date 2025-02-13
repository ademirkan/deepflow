import { db } from "@/lib/firebase";
import { Todo } from "@/types/todo";
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    getDoc,
    serverTimestamp,
    getDocs,
    query,
    where,
} from "firebase/firestore";

interface TodoRepositoryInterface {
    create(uid: string, item: string): Promise<Todo>;
    readAll(uid: string): Promise<Todo[]>;
    readById(uid: string, id: string): Promise<Todo>;
    update(
        uid: string,
        item: Partial<Todo> & Pick<Todo, "id">
    ): Promise<Partial<Todo> & Pick<Todo, "id" | "updatedAt">>;
    delete(uid: string, id: string): Promise<void>;
}

export class FirebaseTodoRepository implements TodoRepositoryInterface {
    async create(uid: string, item: string): Promise<Todo> {
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

    async readAll(uid: string): Promise<Todo[]> {
        if (!uid) {
            throw new Error("User not authenticated");
        }

        const todosCollection = collection(db, "todos");
        const q = query(todosCollection, where("uid", "==", uid));
        const querySnapshot = await getDocs(q);

        const todos: Todo[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            todos.push({
                id: doc.id,
                text: data.text,
                completed: data.completed,
                uid: data.uid,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt.toDate(),
            });
        });
        return todos;
    }

    async readById(uid: string, id: string): Promise<Todo> {
        if (!uid) {
            throw new Error("User not authenticated");
        }

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
        uid: string,
        item: Partial<Todo> & Pick<Todo, "id">
    ): Promise<Partial<Todo> & Pick<Todo, "id" | "updatedAt">> {
        if (!uid) {
            throw new Error("User not authenticated");
        }

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

    async delete(uid: string, id: string): Promise<void> {
        if (!uid) {
            throw new Error("User not authenticated");
        }

        const todoDoc = doc(db, "todos", id);
        await deleteDoc(todoDoc);
    }
}

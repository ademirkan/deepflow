import { db } from "@/lib/firebase";
import { Todo } from "@/types/todoTypes";
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";

// Fetch all todos
export const fetchTodos = async (): Promise<Todo[]> => {
    const todosCollection = collection(db, "todos");
    const snapshot = await getDocs(todosCollection);
    return snapshot.docs.map((doc) => ({
        ...(doc.data() as Todo),
        id: doc.id,
    }));
};

// Add a new todo
export const addTodo = async (todo: {
    text: string;
    uid: string;
}): Promise<Todo> => {
    const todosCollection = collection(db, "todos");
    const docRef = await addDoc(todosCollection, {
        ...todo,
        completed: false,
    });
    return { id: docRef.id, ...todo, completed: false };
};

// Delete a todo
export const deleteTodo = async (id: string): Promise<void> => {
    const todoDoc = doc(db, "todos", id);
    await deleteDoc(todoDoc);
};

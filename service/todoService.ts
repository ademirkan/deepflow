import { db } from "@/lib/firebase";
import { Todo } from "@/types/todoTypes";
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
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
}): Promise<string> => {
    const todosCollection = collection(db, "todos");
    const docRef = await addDoc(todosCollection, {
        ...todo,
        completed: false,
    });
    return docRef.id;
};

// Toggle a todo completion
export const updateTodoCompletion = async (
    id: string,
    completed: boolean
): Promise<void> => {
    const todoDoc = doc(db, "todos", id);
    if (!todoDoc) {
        return Promise.reject("Todo not found");
    }
    await updateDoc(todoDoc, { completed });
    return Promise.resolve();
};

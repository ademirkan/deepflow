import { Todo } from "@/types/todo";
import { FirebaseTodoRepository } from "@/repositories/todo";
import useAuthStore from "@/store/auth";

class TodoService {
    private todoRepository: FirebaseTodoRepository;

    constructor(todoRepository: FirebaseTodoRepository) {
        this.todoRepository = todoRepository;
    }

    async createTodo(text: string): Promise<Todo> {
        const uid = useAuthStore.getState().user?.uid;
        if (!uid) {
            throw new Error("User not authenticated");
        }
        return this.todoRepository.create(uid, text);
    }

    async fetchAllTodos(): Promise<Todo[]> {
        const uid = useAuthStore.getState().user?.uid;
        if (!uid) {
            throw new Error("User not authenticated");
        }
        return this.todoRepository.readAll(uid);
    }

    async updateTodoCompletion(
        id: string,
        completed: boolean
    ): Promise<{ id: string; completed: boolean; updatedAt: Date }> {
        const uid = useAuthStore.getState().user?.uid;
        if (!uid) {
            throw new Error("User not authenticated");
        }
        return this.todoRepository.update(uid, { id, completed }) as Promise<{
            id: string;
            completed: boolean;
            updatedAt: Date;
        }>;
    }

    async updateTodoText(
        id: string,
        text: string
    ): Promise<{ id: string; text: string; updatedAt: Date }> {
        const uid = useAuthStore.getState().user?.uid;
        if (!uid) {
            throw new Error("User not authenticated");
        }
        return this.todoRepository.update(uid, { id, text }) as Promise<{
            id: string;
            text: string;
            updatedAt: Date;
        }>;
    }

    async deleteTodo(id: string): Promise<void> {
        const uid = useAuthStore.getState().user?.uid;
        if (!uid) {
            throw new Error("User not authenticated");
        }
        return this.todoRepository.delete(uid, id);
    }
}

const todoService = new TodoService(new FirebaseTodoRepository());

export default todoService;

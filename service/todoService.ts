// Logic behind Service layer
// Service layer is the layer that contains the business logic of the application
// It does not care what the details of the data layer are
// It does not care about what backend is used
// All it cares about is taking care of the business logic for the application requirements
// For instance, if we had a rule that we cannot create a todo with text that is empty, that would go here
// Or if we had a rule that we cannot create a todo with text that is longer than 100 characters, that would go here

import { Todo } from "@/types/todoTypes";
import { FirebaseTodoRepository } from "@/repositories/todoRepository";

class TodoService {
    private todoRepository: FirebaseTodoRepository;

    constructor(todoRepository: FirebaseTodoRepository) {
        this.todoRepository = todoRepository;
    }

    async createTodo(text: string): Promise<Todo> {
        return this.todoRepository.create(text);
    }

    async fetchAllTodos(): Promise<Todo[]> {
        return this.todoRepository.readAll();
    }

    async updateTodoCompletion(
        id: string,
        completed: boolean
    ): Promise<{ id: string; completed: boolean; updatedAt: Date }> {
        return this.todoRepository.update({ id, completed }) as Promise<{
            id: string;
            completed: boolean;
            updatedAt: Date;
        }>;
    }

    async updateTodoText(
        id: string,
        text: string
    ): Promise<{ id: string; text: string; updatedAt: Date }> {
        return this.todoRepository.update({ id, text }) as Promise<{
            id: string;
            text: string;
            updatedAt: Date;
        }>;
    }

    async deleteTodo(id: string): Promise<void> {
        return this.todoRepository.delete(id);
    }
}

const todoService = new TodoService(new FirebaseTodoRepository());

export default todoService;

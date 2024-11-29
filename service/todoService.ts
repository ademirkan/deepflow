import { Todo, TodoRepository } from "@/types/todoTypes";
import { FirebaseTodoRepository } from "@/repositories/firebaseTodoRepository";

class TodoService {
    private todoRepository: TodoRepository;

    constructor(todoRepository: TodoRepository) {
        this.todoRepository = todoRepository;
    }

    async addTodo(text: string): Promise<Todo> {
        return this.todoRepository.add(text);
    }

    async fetchTodos(): Promise<Todo[]> {
        return this.todoRepository.getAll();
    }

    async updateTodoCompletion(id: string, completed: boolean): Promise<void> {
        return this.todoRepository.updateCompletion(id, completed);
    }

    async updateTodoText(id: string, text: string): Promise<void> {
        return this.todoRepository.updateText(id, text);
    }

    async deleteTodo(id: string): Promise<void> {
        return this.todoRepository.delete(id);
    }
}

const todoService = new TodoService(new FirebaseTodoRepository());

export default todoService;

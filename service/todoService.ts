import { Todo, TodoRepository } from "@/types/todoTypes";
import { FirebaseTodoRepository } from "@/repositories/firebaseTodoRepository";
// You can inject a different repository implementation here
const todoRepository: TodoRepository = new FirebaseTodoRepository();

export const addTodo = async (text: string): Promise<Todo> => {
    return todoRepository.add(text);
};

export const fetchTodos = async () => {
    return todoRepository.getAll();
};

export const updateTodoCompletion = async (
    id: string,
    completed: boolean
): Promise<void> => {
    return todoRepository.updateCompletion(id, completed);
};

export const updateTodoText = async (
    id: string,
    text: string
): Promise<void> => {
    return todoRepository.updateText(id, text);
};

export const deleteTodo = async (id: string): Promise<void> => {
    return todoRepository.delete(id);
};

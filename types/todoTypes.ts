export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    uid: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface TodoRepository {
    add(text: string): Promise<Todo>;
    getAll(): Promise<Todo[]>;
    updateCompletion(id: string, completed: boolean): Promise<void>;
    updateText(id: string, text: string): Promise<void>;
    delete(id: string): Promise<void>;
}

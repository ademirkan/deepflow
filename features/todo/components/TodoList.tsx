import React from "react";
import TodoItem from "./TodoItem";
import { Todo } from "@/types/todo";

type TodoListProps = {
    todos: Todo[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string, text: string) => void;
};

const TodoList: React.FC<TodoListProps> = ({
    todos,
    onToggle,
    onDelete,
    onEdit,
}) => {
    return (
        <ul className="flex flex-col gap-2 relative w-64">
            {todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    text={todo.text}
                    completed={todo.completed}
                    onToggle={() => onToggle(todo.id)}
                    onDelete={() => onDelete(todo.id)}
                    onEdit={(newText: string) => onEdit(todo.id, newText)}
                />
            ))}
        </ul>
    );
};

export default TodoList;

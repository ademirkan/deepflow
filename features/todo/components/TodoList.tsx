import React from "react";
import TodoItem from "./TodoItem";
import { Todo } from "@/types/todoTypes";

type TodoListProps = {
    todos: Todo[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
};

const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onDelete }) => {
    return (
        <ul>
            {todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    text={todo.text}
                    completed={todo.completed}
                    onToggle={() => onToggle(todo.id)}
                    onDelete={() => onDelete(todo.id)}
                />
            ))}
        </ul>
    );
};

export default TodoList;

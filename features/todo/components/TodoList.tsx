import React, { useState } from "react";
import TodoItem from "./TodoItem";

type Todo = {
    id: number;
    text: string;
    completed: boolean;
};

type TodoListProps = {
    todos: Todo[];
    onToggle: (id: number) => void;
};

const TodoList: React.FC<TodoListProps> = ({ todos, onToggle }) => {
    return (
        <ul>
            {todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    text={todo.text}
                    completed={todo.completed}
                    onToggle={() => onToggle(todo.id)}
                />
            ))}
        </ul>
    );
};

export default TodoList;

"use client";

import React, { useState } from "react";
import TodoList from "./TodoList";
import CreateTodoItem from "./CreateTodoItem";

type Todo = {
    id: number;
    text: string;
    completed: boolean;
};

const initialTodos: Todo[] = [
    { id: 1, text: "Learn React", completed: false },
    { id: 2, text: "Build a Todo App", completed: false },
];

const TodoContainer: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>(initialTodos);
    const [isAdding, setIsAdding] = useState(false);

    const handleToggle = (id: number) => {
        setTodos((prevTodos) => {
            return prevTodos.map((todo) => {
                if (todo.id === id) {
                    return { ...todo, completed: !todo.completed };
                }
                return todo;
            });
        });
    };

    function handleAddTodo(text: string): void {
        setTodos((prevTodos) => [
            ...prevTodos,
            { id: Date.now(), text, completed: false },
        ]);
        setIsAdding(false);
    }

    return (
        <div>
            <h1>Todo List</h1>
            <TodoList todos={todos} onToggle={handleToggle} />
            {isAdding ? (
                <CreateTodoItem
                    onAdd={handleAddTodo}
                    onCancel={() => setIsAdding(false)}
                />
            ) : (
                <button onClick={() => setIsAdding(true)}>+</button>
            )}
        </div>
    );
};

export default TodoContainer;

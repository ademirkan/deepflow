"use client";

import React, { useEffect, useState } from "react";
import TodoList from "./TodoList";
import CreateTodoItem from "./CreateTodoItem";
import { addTodo, fetchTodos } from "@/service/todoService";
import { Todo } from "@/types/todoTypes";

const TodoContainer: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        fetchTodos().then((todos) => {
            setTodos(todos);
        });
    }, []);

    const handleToggle = (id: string) => {
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
        const prevTodos = todos;
        setIsAdding(false);
        setTodos((prevTodos) => [
            ...prevTodos,
            { id: Date.now().toString(), text, completed: false, uid: "" },
        ]);

        addTodo({ text, uid: "" })
            .then((todo) => {
                setTodos((prevTodos) =>
                    prevTodos.map((t) => (t.id === todo.id ? todo : t))
                );
                console.log(todo);
            })
            .catch((error) => {
                console.error(error);
                setTodos(prevTodos);
            });
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

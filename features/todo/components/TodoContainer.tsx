"use client";

import React, { useEffect, useState } from "react";
import TodoList from "./TodoList";
import CreateTodoItem from "./CreateTodoItem";
import {
    addTodo,
    fetchTodos,
    updateTodoCompletion,
} from "@/service/todoService";
import { Todo } from "@/types/todoTypes";

const TodoContainer: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        fetchTodos().then((todos) => {
            setTodos(todos);
        });
    }, []);

    const handleToggle = (id: string): void => {
        // Get current todo status
        const currentTodoStatus = todos.find((todo) => todo.id === id)
            ?.completed as boolean;

        // Optimistic update
        setTodos((prevTodos) =>
            prevTodos.map((todo) =>
                todo.id === id
                    ? { ...todo, completed: !currentTodoStatus }
                    : todo
            )
        );

        // Update server
        updateTodoCompletion(id, !currentTodoStatus).catch((error: Error) => {
            console.error(error);
            // Rollback
            setTodos((prevTodos) =>
                prevTodos.map((todo) =>
                    todo.id === id
                        ? { ...todo, completed: currentTodoStatus }
                        : todo
                )
            );
        });
    };

    const handleAddTodo = (text: string): void => {
        setIsAdding(false);

        // Optimistic update
        const tempId = Date.now().toString();
        setTodos((prevTodos) => [
            ...prevTodos,
            { id: tempId, text, completed: false, uid: "" },
        ]);

        // Add to server
        addTodo({ text, uid: "" })
            .then((todoId) => {
                // Update optimistic update to reflect server id
                const todoToUpdate = todos.find((todo) => todo.id === tempId);
                if (todoToUpdate) {
                    todoToUpdate.id = todoId;
                }
            })
            .catch((error) => {
                // Rollback
                console.error(error);
                setTodos((prevTodos) =>
                    prevTodos.filter((todo) => todo.id !== tempId)
                );
            });
    };

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

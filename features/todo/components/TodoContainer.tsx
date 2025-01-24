"use client";

import React, { useEffect, useState } from "react";
import TodoList from "./TodoList";
import CreateTodoItem from "./CreateTodoItem";
import { Todo } from "@/types/todoTypes";
import useAuthStore from "@/store/useAuthStore";
import todoService from "@/service/todoService";

const TodoContainer: React.FC = () => {
    const { user, loading: authLoading } = useAuthStore();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            todoService.fetchAllTodos().then((fetchedTodos) => {
                setTodos(fetchedTodos);
                setLoading(false);
            });
        } else if (!authLoading) {
            setTodos([]);
            setLoading(false);
        }
    }, [user, authLoading]);

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
        todoService
            .updateTodoCompletion(id, !currentTodoStatus)
            .catch((error: Error) => {
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

    const handleEdit = (id: string, text: string): void => {
        const currentTodo = todos.find((todo) => todo.id === id);
        if (!currentTodo) {
            return;
        }

        setTodos((prevTodos) =>
            prevTodos.map((todo) => (todo.id === id ? { ...todo, text } : todo))
        );

        todoService.updateTodoText(id, text).catch((error: Error) => {
            setTodos((prevTodos) =>
                prevTodos.map((todo) => (todo.id === id ? currentTodo : todo))
            );
        });
    };

    const handleAddTodo = (text: string): void => {
        if (!user) {
            console.error("User is not authenticated.");
            return;
        }

        setIsAdding(false);

        // Optimistic update
        const tempId = Date.now().toString();
        setTodos((prevTodos) => [
            ...prevTodos,
            {
                id: tempId,
                text,
                completed: false,
                uid: user.uid,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);

        // Add to server
        todoService
            .createTodo(text)
            .then((todo) => {
                setTodos((prevTodos) =>
                    prevTodos.map((t) => (t.id === tempId ? todo : t))
                );
            })
            .catch((error) => {
                // Rollback
                console.error(error);
                setTodos((prevTodos) =>
                    prevTodos.filter((todo) => todo.id !== tempId)
                );
            });
    };

    const handleDeleteTodo = (id: string): void => {
        const currentTodo = todos.find((todo) => todo.id === id);
        if (!currentTodo) {
            return;
        }
        // Optimistic update
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));

        // Delete from server
        todoService.deleteTodo(id).catch((error) => {
            // Rollback
            setTodos((prevTodos) => [...prevTodos, currentTodo]);
        });
    };

    if (authLoading || loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <h1>Todo List</h1>
            {user ? (
                <>
                    <TodoList
                        todos={todos}
                        onToggle={handleToggle}
                        onDelete={handleDeleteTodo}
                        onEdit={handleEdit}
                    />
                    {isAdding ? (
                        <CreateTodoItem
                            onAdd={handleAddTodo}
                            onCancel={() => setIsAdding(false)}
                        />
                    ) : (
                        <button onClick={() => setIsAdding(true)}>+</button>
                    )}
                </>
            ) : (
                <div>Please sign in to view your todos.</div>
            )}
        </div>
    );
};

export default TodoContainer;

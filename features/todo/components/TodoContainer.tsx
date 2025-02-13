"use client";

import React, { useState } from "react";
import TodoList from "./TodoList";
import CreateTodoItem from "./CreateTodoItem";
import useAuthStore from "@/store/auth";
import useTodos from "../hooks/useTodos";

const TodoContainer: React.FC = () => {
    const { user, loading: authLoading } = useAuthStore();
    const { todos, toggleTodo, editTodo, addTodo, deleteTodo } = useTodos();

    // Local state to control whether we're adding a new todo.
    const [isAdding, setIsAdding] = useState(false);

    // Display loading until both auth and todos data are ready.
    if (authLoading) {
        return <div>Loading...</div>;
    }

    // If not signed in, prompt the user to sign in.
    if (!user) {
        return <div>Please sign in to view your todos.</div>;
    }

    // Handler to toggle a todo's completed status.
    const handleToggle = (id: string): void => {
        const todo = todos.find((todo) => todo.id === id);
        if (!todo) return;
        toggleTodo(id, !todo.completed);
    };

    // Handler to update a todo's text.
    const handleEdit = (id: string, text: string): void => {
        const todo = todos.find((todo) => todo.id === id);
        if (!todo) return;
        editTodo(id, text);
    };

    // Handler to delete a todo.
    const handleDeleteTodo = (id: string): void => {
        const todo = todos.find((todo) => todo.id === id);
        if (!todo) return;
        deleteTodo(id);
    };

    // Handler to add a new todo.
    const handleAddTodo = (text: string): void => {
        setIsAdding(false);
        addTodo(text);
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <h1>Todo List</h1>
            <>
                <TodoList
                    todos={todos}
                    onToggle={handleToggle}
                    onEdit={handleEdit}
                    onDelete={handleDeleteTodo}
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
        </div>
    );
};

export default TodoContainer;

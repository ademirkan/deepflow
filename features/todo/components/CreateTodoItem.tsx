"use client";

import React, { useState, useEffect } from "react";

type CreateTodoItemProps = {
    onAdd: (text: string) => void;
    onCancel: () => void;
};

const CreateTodoItem: React.FC<CreateTodoItemProps> = ({ onAdd, onCancel }) => {
    const [text, setText] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onAdd(text);
            setText("");
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            onCancel();
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a new todo"
                autoFocus
                onBlur={() => onCancel()}
            />
            <button type="submit">Add</button>
            <button type="button" onClick={onCancel}>
                Cancel
            </button>
        </form>
    );
};

export default CreateTodoItem;

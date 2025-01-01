"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useState, useRef, useEffect } from "react";

type TodoItemProps = {
    text: string;
    completed: boolean;
    onToggle: () => void;
    onEdit: (newText: string) => void;
    onDelete: () => void;
};

const TodoItem: React.FC<TodoItemProps> = ({
    text,
    completed,
    onToggle,
    onEdit,
    onDelete,
}) => {
    const [editText, setEditText] = useState(text);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            // onEdit(editText);
            inputRef.current?.blur(); // Unfocus the input when onEdit is called
        } else if (e.key === "Escape") {
            setEditText(text);
        }
    };

    const handleBlur = () => {
        onEdit(editText);
    };

    return (
        <li
            className={`flex items-center justify-between bg-pink-400 w-full p-2 rounded-md`}
        >
            <div className="flex items-center gap-2">
                <Checkbox checked={completed} onCheckedChange={onToggle} />
                <input
                    ref={inputRef}
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    className={`bg-transparent border-none focus:outline-none ${
                        completed ? "line-through" : ""
                    }`}
                />
            </div>
            <Button size="sm" variant="destructive" onClick={onDelete}>
                x
            </Button>
        </li>
    );
};

export default TodoItem;

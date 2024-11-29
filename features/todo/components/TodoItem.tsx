import React from "react";

type TodoItemProps = {
    text: string;
    completed: boolean;
    onToggle: () => void;
    onDelete: () => void;
};

const TodoItem: React.FC<TodoItemProps> = ({
    text,
    completed,
    onToggle,
    onDelete,
}) => {
    return (
        <li className={`flex items-center justify-between bg-pink-400  `}>
            <span
                className={`${completed ? "line-through" : ""}`}
                onClick={onToggle}
            >
                {text}
            </span>
            <button onClick={onDelete}>Delete</button>
        </li>
    );
};

export default TodoItem;

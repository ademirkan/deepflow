import React from "react";

type TodoItemProps = {
    text: string;
    completed: boolean;
    onToggle: () => void;
};

const TodoItem: React.FC<TodoItemProps> = ({ text, completed, onToggle }) => {
    return (
        <li
            onClick={onToggle}
            style={{
                textDecoration: completed ? "line-through" : "none",
                cursor: "pointer",
            }}
        >
            {text}
        </li>
    );
};

export default TodoItem;

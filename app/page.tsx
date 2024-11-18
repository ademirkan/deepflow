import CircularPomodoroTimer from "@/features/timer/components/CircularPomodoroTimer";
import TodoContainer from "@/features/todo/components/TodoContainer";
import TodoList from "@/features/todo/components/TodoList";

export default function Home() {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-red-300">
            <CircularPomodoroTimer />
            <TodoContainer />
        </div>
    );
}

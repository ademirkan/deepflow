import QuickConfig from "@/features/controller/components/QuickConfig";
import CircularPomodoroTimer from "@/features/timer/components/CircularPomodoroTimer";
import TodoContainer from "@/features/todo/components/TodoContainer";

export default function Home() {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-red-300">
            <QuickConfig />
            <CircularPomodoroTimer />
            <TodoContainer />
        </div>
    );
}

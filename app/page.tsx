import CircularPomodoroTimer from "@/features/timer/components/CircularPomodoroTimer";

export default function Home() {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-red-300">
            <CircularPomodoroTimer />
        </div>
    );
}

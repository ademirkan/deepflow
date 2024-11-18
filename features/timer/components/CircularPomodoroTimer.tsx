"use client";

import useStopwatch, { TimerCallbacks } from "../hooks/useStopwatch";
import CircularPomodoroView from "./CircularPomodoroView";

const callbacks: TimerCallbacks = {
    onStart: (now) => {
        console.log("started");
    },
    onTick: (now, elapsedTime, startTime) => {
        console.log("Tick!", elapsedTime);
    },
    onReset: (now, elapsedTime, startTime) => {
        console.log("Reset!");
    },
    onPause: (now, elapsedTime, startTime) => {
        console.log("Stopped!");
    },
    onResume: (now, elapsedTime, startTime) => {
        console.log("resumed");
    },

    onTickEvents: [
        {
            timeElapsed: 5000,
            callback: (time) => {
                console.log("5sec mark! " + time);
            },
        },
        {
            timeElapsed: 10000,
            callback: (time) => {
                console.log("10sec mark! " + time);
            },
        },
    ],
};

const CircularPomodoroTimer = () => {
    const { elapsedMs, isRunning, isStarted, start, stop, reset } =
        useStopwatch(callbacks);

    return (
        <CircularPomodoroView
            targetSeconds={60}
            isRunning={isRunning}
            isStarted={isStarted}
            elapsedSeconds={elapsedMs / 1000}
            onStartClick={function (): void {
                start();
            }}
            onPauseClick={function (): void {
                stop();
            }}
            onResetClick={function (): void {
                reset();
            }}
        />
    );
};

export default CircularPomodoroTimer;

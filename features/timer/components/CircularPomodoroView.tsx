"use client";

import React, { ReactElement } from "react";
import CircularProgress from "./CircularProgress";
import { formatTime } from "../utils";

interface ICircularPomodoroViewProps {
    targetSeconds: number;
    isRunning: boolean;
    isStarted: boolean;
    elapsedSeconds: number;
    onStartClick: () => void;
    onPauseClick: () => void;
    onResetClick: () => void;
    clockwise?: boolean;
    labelArea?: ReactElement;
}

const CircularPomodoroView = (props: ICircularPomodoroViewProps) => {
    const {
        targetSeconds,
        isRunning,
        isStarted,
        elapsedSeconds,
        onStartClick,
        onPauseClick,
        onResetClick,
        clockwise = false,
        labelArea = <div>labelArea</div>,
    } = props;
    let remainingSeconds = targetSeconds - elapsedSeconds;

    return (
        <div className="select-none flex justify-center items-center w-64">
            <CircularProgress
                filledPercent={remainingSeconds / targetSeconds}
                clockwise={clockwise}
                thickness={0.03}
                animationDuration={isRunning ? "1s" : "0.15s"}
            />

            <div className="absolute flex flex-col items-center">
                {labelArea}
                <div className="text-3xl">
                    {formatTime(
                        remainingSeconds < 0
                            ? remainingSeconds * -1
                            : remainingSeconds
                    )}
                </div>
                <div className="flex flex-row gap-4">
                    <span onClick={onStartClick}>
                        {isStarted ? "resume" : "start"}
                    </span>
                    <span onClick={onPauseClick}>pause</span>
                    <span onClick={onResetClick}>reset</span>
                </div>
            </div>
        </div>
    );
};

export default CircularPomodoroView;

"use client";

import React, { useState } from "react";

const QuickConfig = () => {
    const [timerType, setTimerType] = useState<"stopwatch" | "pomodoro">(
        "pomodoro"
    );
    const [alarmActive, setAlarmActive] = useState(false);
    const [overtimeActive, setOvertimeActive] = useState(false);
    const [activePomodoro, setActivePomodoro] = useState<
        15 | 25 | 60 | 90 | "custom"
    >(25);

    return (
        <div className="flex flex-row gap-2">
            {timerType === "pomodoro" && (
                <div
                    id="countdown-config"
                    className="flex flex-row gap-2 border-2"
                >
                    <button
                        onClick={() => setAlarmActive(!alarmActive)}
                        className={alarmActive ? "bg-blue-500 text-white" : ""}
                    >
                        alarm
                    </button>
                    <button
                        onClick={() => setOvertimeActive(!overtimeActive)}
                        className={
                            overtimeActive ? "bg-blue-500 text-white" : ""
                        }
                    >
                        overtime
                    </button>
                </div>
            )}
            <div id="type-config" className="flex flex-row gap-2 border-2">
                <button
                    onClick={() => setTimerType("pomodoro")}
                    className={
                        timerType === "pomodoro" ? "bg-blue-500 text-white" : ""
                    }
                >
                    pomodoro
                </button>
                <button
                    onClick={() => setTimerType("stopwatch")}
                    className={
                        timerType === "stopwatch"
                            ? "bg-blue-500 text-white"
                            : ""
                    }
                >
                    stopwatch
                </button>
            </div>
            {timerType === "pomodoro" && (
                <div
                    id="pomodoro-config"
                    className="flex flex-row gap-2 border-2"
                >
                    {[15, 25, 60, 90, "custom" as const].map((time) => (
                        <button
                            key={time}
                            onClick={() =>
                                setActivePomodoro(
                                    time as 15 | 25 | 60 | 90 | "custom"
                                )
                            }
                            className={
                                activePomodoro === time
                                    ? "bg-blue-500 text-white"
                                    : ""
                            }
                        >
                            {time}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuickConfig;

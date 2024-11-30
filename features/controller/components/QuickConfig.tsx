"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

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
        <div className="flex flex-row gap-6">
            {timerType === "pomodoro" && (
                <div id="countdown-config" className="flex flex-row gap-1">
                    <Button
                        onClick={() => setAlarmActive(!alarmActive)}
                        variant={alarmActive ? "default" : "ghost"}
                    >
                        alarm
                    </Button>
                    <Button
                        onClick={() => setOvertimeActive(!overtimeActive)}
                        variant={overtimeActive ? "default" : "ghost"}
                    >
                        overtime
                    </Button>
                </div>
            )}
            <div id="type-config" className="flex flex-row gap-1">
                <Button
                    onClick={() => setTimerType("pomodoro")}
                    variant={timerType === "pomodoro" ? "default" : "ghost"}
                >
                    pomodoro
                </Button>
                <Button
                    onClick={() => setTimerType("stopwatch")}
                    variant={timerType === "stopwatch" ? "default" : "ghost"}
                >
                    stopwatch
                </Button>
            </div>
            {timerType === "pomodoro" && (
                <div id="pomodoro-config" className="flex flex-row gap-1">
                    {[15, 25, 60, 90, "custom" as const].map((time) => (
                        <Button
                            key={time}
                            onClick={() =>
                                setActivePomodoro(
                                    time as 15 | 25 | 60 | 90 | "custom"
                                )
                            }
                            variant={
                                activePomodoro === time ? "default" : "ghost"
                            }
                        >
                            {time}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuickConfig;

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { usePreferencesStore } from "@/store/preferences";

const QuickConfig = () => {
    // Access state and actions from the store
    const {
        configPreferences,
        setConfigPreferences,
        updateConfigPreferences,
        refreshPreferences,
    } = usePreferencesStore((state) => ({
        configPreferences: state.configPreferences,
        setConfigPreferences: state.setConfigPreferences,
        updateConfigPreferences: state.updateConfigPreferences,
        refreshPreferences: state.refreshPreferences,
    }));

    const { type, alarmActive, overtimeActive, pomodoro } = configPreferences;

    return (
        <div className="flex flex-row gap-6">
            <div id="type-config" className="flex flex-row gap-1">
                <Button
                    onClick={() =>
                        updateConfigPreferences({ type: "pomodoro" })
                    }
                    variant={type === "pomodoro" ? "default" : "ghost"}
                >
                    pomodoro
                </Button>
                <Button
                    onClick={() =>
                        updateConfigPreferences({ type: "countdown" })
                    }
                    variant={type === "countdown" ? "default" : "ghost"}
                >
                    countdown
                </Button>
                <Button
                    onClick={() =>
                        updateConfigPreferences({ type: "stopwatch" })
                    }
                    variant={type === "stopwatch" ? "default" : "ghost"}
                >
                    stopwatch
                </Button>
            </div>
            {(type === "countdown" || type === "pomodoro") && (
                <div id="pomodoro-config" className="flex flex-row gap-1">
                    {["15", "25", "60", "90", "custom"].map((time) => (
                        <Button
                            key={time}
                            onClick={() => {
                                updateConfigPreferences({
                                    pomodoro: {
                                        preset: time as
                                            | "15"
                                            | "25"
                                            | "60"
                                            | "90"
                                            | "custom",
                                    },
                                });
                            }}
                            variant={
                                pomodoro.preset === time ? "default" : "ghost"
                            }
                        >
                            {time}
                        </Button>
                    ))}
                </div>
            )}
            {(type === "pomodoro" || type === "countdown") && (
                <div id="countdown-config" className="flex flex-row gap-1">
                    <Button
                        onClick={() =>
                            updateConfigPreferences({
                                overtimeActive: !overtimeActive,
                            })
                        }
                        variant={overtimeActive ? "default" : "ghost"}
                    >
                        overtime
                    </Button>

                    <Button
                        onClick={() =>
                            updateConfigPreferences({
                                alarmActive: !alarmActive,
                            })
                        }
                        variant={alarmActive ? "default" : "ghost"}
                    >
                        alarm
                    </Button>
                </div>
            )}
        </div>
    );
};

export default QuickConfig;

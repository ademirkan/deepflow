"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/useSettings";

const QuickConfig = () => {
    // Access state and actions from the store
    const { config, updateSettings } = useSettings();

    const { type, alarmActive, overtimeActive, pomodoro, countdown } = config;

    return (
        <div className="flex flex-row gap-6">
            <div id="type-config" className="flex flex-row gap-1">
                <Button
                    onClick={() =>
                        updateSettings({ config: { type: "pomodoro" } })
                    }
                    variant={type === "pomodoro" ? "default" : "ghost"}
                >
                    pomodoro
                </Button>
                <Button
                    onClick={() =>
                        updateSettings({ config: { type: "countdown" } })
                    }
                    variant={type === "countdown" ? "default" : "ghost"}
                >
                    countdown
                </Button>
                <Button
                    onClick={() =>
                        updateSettings({ config: { type: "stopwatch" } })
                    }
                    variant={type === "stopwatch" ? "default" : "ghost"}
                >
                    stopwatch
                </Button>
            </div>
            {(type === "countdown" || type === "pomodoro") && (
                <div id="pomodoro-config" className="flex flex-row gap-1">
                    {(type === "countdown"
                        ? ["15", "30", "60", "120", "custom"]
                        : ["15", "25", "60", "90", "custom"]
                    ).map((time, index) => {
                        const handleClick = () => {
                            const updatedConfig =
                                type === "countdown"
                                    ? {
                                          config: {
                                              countdown: {
                                                  preset: time as
                                                      | "15"
                                                      | "30"
                                                      | "60"
                                                      | "120"
                                                      | "custom",
                                              },
                                          },
                                      }
                                    : {
                                          config: {
                                              pomodoro: {
                                                  preset: time as
                                                      | "15"
                                                      | "25"
                                                      | "60"
                                                      | "90"
                                                      | "custom",
                                              },
                                          },
                                      };
                            updateSettings(updatedConfig);
                        };
                        return (
                            <Button
                                key={index}
                                onClick={handleClick}
                                variant={
                                    (type === "countdown"
                                        ? countdown.preset
                                        : pomodoro.preset) === time
                                        ? "default"
                                        : "ghost"
                                }
                            >
                                {time}
                            </Button>
                        );
                    })}
                </div>
            )}
            {(type === "pomodoro" || type === "countdown") && (
                <div id="countdown-config" className="flex flex-row gap-1">
                    <Button
                        onClick={() =>
                            updateSettings({
                                config: {
                                    overtimeActive: !overtimeActive,
                                },
                            })
                        }
                        variant={overtimeActive ? "default" : "ghost"}
                    >
                        overtime
                    </Button>

                    <Button
                        onClick={() =>
                            updateSettings({
                                config: {
                                    alarmActive: !alarmActive,
                                },
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

import { ConfigPreferences, Preferences } from "@/types/preferenceTypes";

export const defaultConfigPreferences: ConfigPreferences = {
    alarmActive: true,
    overtimeActive: false,
    type: "pomodoro" as "pomodoro" | "countdown" | "stopwatch",
    pomodoro: {
        preset: "25" as "15" | "25" | "60" | "90" | "custom",
        custom: {
            studyDuration: 25,
            shortBreakDuration: 5,
            longBreakDuration: 15,
            sessionsBeforeLongBreak: 4,
        },
    },
    countdown: {
        preset: "30" as "15" | "30" | "60" | "120" | "custom",
        custom: 30,
    },
};

export const defaultPreferences: Preferences = {
    configPreferences: defaultConfigPreferences,
};

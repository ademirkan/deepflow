import { ConfigSettings, Settings, ThemeSettings } from "@/types/settings";

export const DEFAULT_CONFIG_SETTINGS: ConfigSettings = {
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

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
    theme: "light" as "light" | "dark",
};

export const DEFAULT_SETTINGS: Settings = {
    config: DEFAULT_CONFIG_SETTINGS,
    theme: DEFAULT_THEME_SETTINGS,
};

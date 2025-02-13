// Root setting type
export type Settings = {
    config: ConfigSettings;
    theme: ThemeSettings;
    // Add other setting types here
};

export interface ConfigSettings {
    alarmActive: boolean;
    overtimeActive: boolean;
    type: "pomodoro" | "countdown" | "stopwatch";
    pomodoro: {
        preset: "15" | "25" | "60" | "90" | "custom"; // Valid: 15 | 25 | 60 | 90 | "custom"
        custom: {
            studyDuration: number; // Duration in minutes for study
            shortBreakDuration: number; // Duration in minutes for a short break
            longBreakDuration: number; // Duration in minutes for a long break
            sessionsBeforeLongBreak: number;
        };
    };
    countdown: {
        preset: "15" | "30" | "60" | "120" | "custom"; // Valid: 15 | 25 | 60 | 90 | "custom"
        custom: number; // User-defined custom configuration
    };
    // stopwatch: {};
}

export type ThemeSettings = {
    theme: "light" | "dark";
};

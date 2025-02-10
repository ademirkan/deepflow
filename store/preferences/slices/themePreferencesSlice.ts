// Example of another slice (you might have more preferences)
export interface ThemePreferencesSlice {
    theme: string;
    setTheme: (theme: string) => void;
}

export const createThemePreferencesSlice = (
    set: (partial: any) => void,
    get: () => any
): ThemePreferencesSlice => ({
    theme: "light", // default theme
    setTheme: (theme: string) => set({ theme }),
});

import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import deepMerge from "@/util/deepMerge";
import preferencesService from "@/service/preferencesService";
import useAuthStore from "@/store/auth";
import { PREFERENCES_STORAGE_KEY } from "@/constants/cacheKeys";
import {
    createConfigPreferencesSlice,
    ConfigPreferencesSlice,
} from "./slices/configPreferencesSlice";
import {
    createThemePreferencesSlice,
    ThemePreferencesSlice,
} from "./slices/themePreferencesSlice";

// Combine slices into one modular store
type PreferencesStore = ConfigPreferencesSlice &
    ThemePreferencesSlice & {
        refreshPreferences: () => void;
    };

// --- Fetching from DB ---
async function fetchPreferencesFromDB(): Promise<Partial<PreferencesStore>> {
    try {
        const preferences = await preferencesService.getPreferences();
        console.log("Fetched DB preferences:", preferences);
        return preferences || {};
    } catch (error) {
        console.error("Failed to fetch preferences from DB:", error);
        return {};
    }
}

// --- Creating the Store ---
export const usePreferencesStore = create<PreferencesStore>()(
    persist(
        subscribeWithSelector((set, get) => {
            return {
                ...createConfigPreferencesSlice(set, get),
                ...createThemePreferencesSlice(set, get),
                refreshPreferences: async () => {
                    // Fetch preferences from DB
                    const dbPreferences = await fetchPreferencesFromDB();
                    console.log("refreshPreferences DB data:", dbPreferences);

                    // Get the current state (which might have been rehydrated)
                    const currentState = get();

                    // Merge the state (for instance, using a deep merge)
                    set({
                        configPreferences: deepMerge(
                            currentState.configPreferences,
                            dbPreferences.configPreferences || {}
                        ),
                        theme: dbPreferences.theme || currentState.theme,
                    });
                },
            };
        }),
        {
            name: PREFERENCES_STORAGE_KEY,
            getStorage: () => localStorage,
        }
    )
);

useAuthStore.subscribe((authState) => {
    if (authState.user) {
        usePreferencesStore.getState().refreshPreferences();
    }
});

import { ConfigPreferences } from "@/types/preferenceTypes";
import { deepMerge, DeepPartial } from "@/util/deepMerge";
import preferencesService from "@/service/preferencesService";
import useAuthStore from "@/store/auth";
import { defaultConfigPreferences } from "@/constants/defaultPreferences";

/**
 * Interface representing the configuration preferences slice.
 */
export interface ConfigPreferencesSlice {
    configPreferences: ConfigPreferences;
    setConfigPreferences: (preferences: ConfigPreferences) => void;
    updateConfigPreferences: (update: DeepPartial<ConfigPreferences>) => void;
}

/**
 * Factory function to create a configuration preferences slice.
 *
 * @param set - Function to update the state.
 * @param get - Function to retrieve the current state.
 * @returns An object implementing the ConfigPreferencesSlice interface.
 */
export const createConfigPreferencesSlice = (
    set: (partial: any) => void,
    get: () => any
): ConfigPreferencesSlice => ({
    configPreferences: defaultConfigPreferences,
    /**
     * Sets the configuration preferences.
     *
     * @param preferences - The new configuration preferences to set.
     */
    setConfigPreferences: (preferences: ConfigPreferences) => {
        const authState = useAuthStore.getState();
        if (authState.user) {
            preferencesService.setPreferences({
                configPreferences: preferences,
            });
        }
        set({ configPreferences: preferences });
    },
    /**
     * Updates the configuration preferences with a partial update.
     *
     * @param update - A partial update to apply to the current preferences.
     */
    updateConfigPreferences: (update: DeepPartial<ConfigPreferences>) => {
        const authState = useAuthStore.getState();
        set((state: any) => {
            const currentPreferences = state.configPreferences;
            const updatedPreferences = deepMerge(currentPreferences, update);
            if (authState.user) {
                preferencesService.setPreferences({
                    configPreferences: updatedPreferences,
                });
            }
            return { configPreferences: updatedPreferences };
        });
    },
});

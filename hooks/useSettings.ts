import { useEffect, useRef } from "react";
import { useSettingsStore } from "@/store/settings";
import settingsService from "@/service/settings";
import { Settings } from "@/types/settings";
import { DEBOUNCE_TIME } from "@/constants/utility";
import { DeepPartial } from "@/types/utility";
import _ from "lodash";

export const useSettings = () => {
    const settings = useSettingsStore((state) => state);
    const debouncedServiceCallRef = useRef<
        ((settings: Settings) => void) | null
    >(null);

    useEffect(() => {
        settingsService.getSettings().then((fetchedSettings) => {
            settings.update(fetchedSettings);
        });
    }, []);

    if (!debouncedServiceCallRef.current) {
        debouncedServiceCallRef.current = _.debounce(
            (updatedSettings: Settings) => {
                settingsService.setSettings(updatedSettings);
            },
            DEBOUNCE_TIME
        );
    }

    const updateSettings = (update: DeepPartial<Settings>) => {
        // Instant state update
        const settingsObject = {
            config: settings.config,
            theme: settings.theme,
        };
        const mergedSettings: Settings = _.merge(settingsObject, update);
        settings.update(mergedSettings);

        // Debounced service call
        debouncedServiceCallRef.current!(mergedSettings);
    };

    return {
        config: settings.config,
        theme: settings.theme,
        updateSettings,
    };
};

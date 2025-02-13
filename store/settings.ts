import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { DeepPartial } from "@/types/utility";
import { Settings } from "@/types/settings";
import { SETTINGS_STORAGE_KEY } from "@/constants/keys";
import { DEFAULT_THEME_SETTINGS } from "@/constants/default";
import { DEFAULT_CONFIG_SETTINGS } from "@/constants/default";
import _ from "lodash";
interface SettingsStoreActions {
    update: (update: DeepPartial<Settings>) => void;
    reset?: () => void;
}

type SettingsStore = Settings & SettingsStoreActions;

export const useSettingsStore = create<SettingsStore>()(
    persist(
        subscribeWithSelector((set, get) => ({
            config: DEFAULT_CONFIG_SETTINGS,
            theme: DEFAULT_THEME_SETTINGS,
            update: (update: DeepPartial<Settings>) => {
                set((state) => _.merge({}, state, update));
            },
        })),
        {
            name: SETTINGS_STORAGE_KEY,
        }
    )
);

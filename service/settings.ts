import { Settings } from "@/types/settings";
import { DEFAULT_SETTINGS } from "@/constants/default";
import useAuthStore from "@/store/auth";
import { FirebaseSettingsRepository } from "@/repositories/settings";

class SettingsService {
    private repository: FirebaseSettingsRepository;

    constructor(repository: FirebaseSettingsRepository) {
        this.repository = repository;
    }

    async setDefaultSettings(): Promise<Settings> {
        const uid = useAuthStore.getState().user?.uid;
        if (!uid) {
            throw new Error("User not authenticated");
        }
        const settings = await this.repository.create(uid, DEFAULT_SETTINGS);
        return settings;
    }

    async getSettings(): Promise<Settings> {
        const uid = useAuthStore.getState().user?.uid;
        if (!uid) {
            throw new Error("User not authenticated");
        }
        const savedSettings = await this.repository.read(uid);
        return savedSettings;
    }

    async setSettings(settings: Settings): Promise<Settings> {
        const uid = useAuthStore.getState().user?.uid;
        if (!uid) {
            throw new Error("User not authenticated");
        }
        const updatedSettings = await this.repository.set(uid, settings);
        return updatedSettings;
    }
}

// Instantiate the service with the repository
const settingsService = new SettingsService(new FirebaseSettingsRepository());

export default settingsService;

import { Preferences } from "@/types/preferenceTypes";
import { FirebasePreferencesRepository } from "@/repositories/preferencesRepository";
import { defaultPreferences } from "@/constants/defaultPreferences";
import useAuthStore from "@/store/auth";

class PreferencesService {
    private repository: FirebasePreferencesRepository;

    constructor(repository: FirebasePreferencesRepository) {
        this.repository = repository;
    }

    async setDefaultPreferences(): Promise<Preferences> {
        const uid = useAuthStore.getState().user?.uid;
        if (!uid) {
            throw new Error("User not authenticated");
        }
        const preferences = await this.repository.create(
            uid,
            defaultPreferences
        );
        return preferences;
    }

    async getPreferences(): Promise<Preferences> {
        const uid = useAuthStore.getState().user?.uid;
        if (!uid) {
            throw new Error("User not authenticated");
        }
        const savedPreferences = await this.repository.read(uid);
        return savedPreferences;
    }

    async setPreferences(preferences: Preferences): Promise<Preferences> {
        const uid = useAuthStore.getState().user?.uid;
        if (!uid) {
            throw new Error("User not authenticated");
        }
        const updatedPreferences = await this.repository.set(uid, preferences);
        return updatedPreferences;
    }
}

// Instantiate the service with the repository
const preferencesService = new PreferencesService(
    new FirebasePreferencesRepository()
);

export default preferencesService;

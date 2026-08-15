export interface UpdateSystemSettingsData {
    isLoginEnabled?: boolean;
    isSignupEnabled?: boolean;
}

export abstract class SystemSettingsRepository {
    abstract getSystemSettings(): Promise<any>;

    abstract updateSystemSettings(
        data: UpdateSystemSettingsData,
    ): Promise<any>;
}
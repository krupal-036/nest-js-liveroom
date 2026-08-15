import {
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';

import {
    SystemSettingsRepository,
    UpdateSystemSettingsData,
} from './repositories/SystemSettingsRepository';

@Injectable()
export class SystemSettingsService {
    constructor(
        private readonly systemSettingsRepo: SystemSettingsRepository,
    ) {}

    async getSettings() {
        try {
            return await this.systemSettingsRepo.getSystemSettings();
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to load system settings.',
            );
        }
    }

    async updateSettings(data: UpdateSystemSettingsData) {
        try {
            return await this.systemSettingsRepo.updateSystemSettings(data);
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to update system settings.',
            );
        }
    }

    async isLoginEnabled(): Promise<boolean> {
        const settings =
            await this.systemSettingsRepo.getSystemSettings();

        return settings.isLoginEnabled;
    }

    async isSignupEnabled(): Promise<boolean> {
        const settings =
            await this.systemSettingsRepo.getSystemSettings();

        return settings.isSignupEnabled;
    }
}
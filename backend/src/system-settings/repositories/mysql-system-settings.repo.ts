import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


import {
    SystemSettingsRepository,
    UpdateSystemSettingsData,
} from './SystemSettingsRepository';
import { SystemSettingsEntity } from '../entities/system-settings.entity';

@Injectable()
export class MysqlSystemSettingsRepository
    implements SystemSettingsRepository {
    constructor(
        @InjectRepository(SystemSettingsEntity)
        private readonly systemSettingsRepo: Repository<SystemSettingsEntity>,
    ) { }

    async getSystemSettings(): Promise<SystemSettingsEntity> {
        let settings = await this.systemSettingsRepo.findOne({
            where: {
                configName: 'global_config',
            },
        });

        if (!settings) {
            settings = this.systemSettingsRepo.create({
                configName: 'global_config',
                isLoginEnabled: true,
                isSignupEnabled: true,
            });

            settings = await this.systemSettingsRepo.save(settings);
        }

        return settings;
    }

    async updateSystemSettings(
        data: UpdateSystemSettingsData,
    ): Promise<SystemSettingsEntity> {
        let settings = await this.getSystemSettings();

        if (data.isLoginEnabled !== undefined) {
            settings.isLoginEnabled = data.isLoginEnabled;
        }

        if (data.isSignupEnabled !== undefined) {
            settings.isSignupEnabled = data.isSignupEnabled;
        }

        return this.systemSettingsRepo.save(settings);
    }
}
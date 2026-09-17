// backend/src/system-settings/repositories/mongoose-system-settings.repo.ts
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
    SystemSettings,
    SystemSettingsDocument,
} from "@/system-settings/entities/system-settings.schema";
import {
    SystemSettingsRepository,
    UpdateSystemSettingsData,
} from "@/system-settings/repositories/SystemSettingsRepository";

@Injectable()
export class MongooseSystemSettingsRepository implements SystemSettingsRepository {
    constructor(
        @InjectModel(SystemSettings.name)
        private readonly systemSettingsModel: Model<SystemSettingsDocument>,
    ) {}

    async getSystemSettings(): Promise<SystemSettingsDocument> {
        let settings = await this.systemSettingsModel.findOne({
            configName: "global_config",
        });

        if (!settings) {
            settings = await this.systemSettingsModel.create({
                configName: "global_config",
                isLoginEnabled: true,
                isSignupEnabled: true,
            });
        }

        return settings;
    }

    async updateSystemSettings(data: UpdateSystemSettingsData): Promise<SystemSettingsDocument> {
        return this.systemSettingsModel.findOneAndUpdate(
            {
                configName: "global_config",
            },
            {
                $set: {
                    ...(data.isLoginEnabled !== undefined && {
                        isLoginEnabled: data.isLoginEnabled,
                    }),
                    ...(data.isSignupEnabled !== undefined && {
                        isSignupEnabled: data.isSignupEnabled,
                    }),
                },
            },
            {
                new: true,
                upsert: true,
            },
        );
    }
}

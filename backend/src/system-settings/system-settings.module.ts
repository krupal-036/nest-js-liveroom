// backend/src/system-settings/system-settings.module.ts
import { Module } from "@nestjs/common";
import { AppConfig } from "@/common/config/AppConfig";
import { SystemSettingsService } from "@/system-settings/system-settings.service";
import { SystemSettingsController } from "@/system-settings/system-settings.controller";
import { SystemSettingsRepository } from "@/system-settings/repositories/SystemSettingsRepository";
import { MysqlSystemSettingsRepository } from "@/system-settings/repositories/mysql-system-settings.repo";
import { MongooseSystemSettingsRepository } from "@/system-settings/repositories/mongoose-system-settings.repo";

@Module({
    imports: [...(AppConfig.IS_MONGO ? [AppConfig.MongoforFeature] : [AppConfig.MysqlforFeature])],

    controllers: [SystemSettingsController],

    providers: [
        SystemSettingsService,
        {
            provide: SystemSettingsRepository,
            useClass: AppConfig.IS_MONGO
                ? MongooseSystemSettingsRepository
                : MysqlSystemSettingsRepository,
        },
    ],

    exports: [SystemSettingsService],
})
export class SystemSettingsModule {}

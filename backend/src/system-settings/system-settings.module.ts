import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppConfig } from 'src/common/config/AppConfig';

import { SystemSettingsService } from './system-settings.service';
import { SystemSettingsController } from './system-settings.controller';

import { SystemSettingsRepository } from './repositories/SystemSettingsRepository';
import { MongooseSystemSettingsRepository } from './repositories/mongoose-system-settings.repo';
import { MysqlSystemSettingsRepository } from './repositories/mysql-system-settings.repo';

@Module({
    imports: [...(AppConfig.IS_MONGO ? [AppConfig.MonogoforFeature] : [AppConfig.MysqlforFeature])],

    controllers: [SystemSettingsController],

    providers: [SystemSettingsService,
        {
            provide: SystemSettingsRepository,
            useClass: AppConfig.IS_MONGO
                ? MongooseSystemSettingsRepository
                : MysqlSystemSettingsRepository,
        },
    ],

    exports: [
        SystemSettingsService,
    ],
})
export class SystemSettingsModule { }
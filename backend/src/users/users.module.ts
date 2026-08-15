import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../common/guards/auth.guard';
import { AppConfig } from 'src/common/config/AppConfig';
import { UserRepository } from './repositories/UserRepository';
import { MongooseUserRepo } from './repositories/MongooseUserRepo';
import { MysqlUserRepo } from './repositories/MysqlUserRepo';
import { SystemSettingsModule } from 'src/system-settings/system-settings.module';

@Module({
    imports: [AppConfig.IS_MONGO ? AppConfig.MonogoforFeature : AppConfig.MysqlforFeature, SystemSettingsModule],
    controllers: [UsersController],
    providers: [
        UsersService,
        {
            provide: UserRepository,
            useClass: AppConfig.IS_MONGO ? MongooseUserRepo : MysqlUserRepo,
        },
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class UsersModule {}

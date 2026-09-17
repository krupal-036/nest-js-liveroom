// backend/src/users/users.module.ts
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { UsersService } from "@/users/users.service";
import { AppConfig } from "@/common/config/AppConfig";
import { AuthGuard } from "@/common/guards/auth.guard";
import { UsersController } from "@/users/users.controller";
import { MysqlUserRepo } from "@/users/repositories/MysqlUserRepo";
import { UserRepository } from "@/users/repositories/UserRepository";
import { MongooseUserRepo } from "@/users/repositories/MongooseUserRepo";
import { SystemSettingsModule } from "@/system-settings/system-settings.module";

@Module({
    imports: [
        AppConfig.IS_MONGO ? AppConfig.MongoforFeature : AppConfig.MysqlforFeature,
        SystemSettingsModule,
    ],
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

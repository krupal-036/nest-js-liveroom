// backend/src/app.module.ts
import { ChatModule } from "@/chat/chat.module";
import { AppController } from "@/app.controller";
import { UsersModule } from "@/users/users.module";
import { ThrottlerGuard } from "@nestjs/throttler";
import { AppConfig } from "@/common/config/AppConfig";
import { SeederModule } from "@/seeding/seeder.module";
import { Module, ValidationPipe } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { LoggingInterceptor } from "@/common/interceptors/logging.interceptor";
import { SystemSettingsModule } from "@/system-settings/system-settings.module";

@Module({
    imports: [
        AppConfig.IS_MONGO ? AppConfig.MongoforRoot : AppConfig.MysqlforRoot,
        UsersModule,
        SeederModule,
        SystemSettingsModule,
        ChatModule,
        AppConfig.JwtModule,
        AppConfig.ThrottlerModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_PIPE,
            useFactory: () => {
                return new ValidationPipe({
                    whitelist: true,
                    transform: true,
                });
            },
        },
        ...(AppConfig.NODE_ENV !== "production"
            ? [
                  {
                      provide: APP_INTERCEPTOR,
                      useClass: LoggingInterceptor,
                  },
              ]
            : []),
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}

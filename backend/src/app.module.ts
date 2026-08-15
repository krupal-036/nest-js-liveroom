import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AppConfig } from './common/config/AppConfig';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { ChatModule } from './chat/chat.module';
import { ThrottlerGuard } from '@nestjs/throttler';
import { SeederModule } from './seeding/seeder.module';
import { SystemSettingsModule } from './system-settings/system-settings.module';

@Module({
  imports: [
    AppConfig.IS_MONGO ? AppConfig.MongoforRoot : AppConfig.MysqlforRoot,
    UsersModule,
    SeederModule,
    SystemSettingsModule,
    ChatModule,
    AppConfig.JwtModule,
    AppConfig.ThrottlerModule
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
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }

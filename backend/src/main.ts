import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppConfig } from './common/config/AppConfig';
import cookieParser from 'cookie-parser';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.useStaticAssets(join(__dirname, '..', 'public'), {});
    app.use(cookieParser());
    app.enableCors({
        origin: true,
        credentials: true,
    });

    if(AppConfig.NODE_ENV !== 'production') {
      app.use(new LoggerMiddleware().use);
    }

    await app.listen(AppConfig.PORT);
}

bootstrap();

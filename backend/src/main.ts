import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { AppConfig } from "./common/config/AppConfig";
import cookieParser from "cookie-parser";
import { LoggerMiddleware } from "./common/middleware/logger.middleware";
import { UnauthorizedException } from "@nestjs/common";
import { SpaExceptionFilter } from "./common/filters/spa-exception.filter";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const isDevelopment = AppConfig.NODE_ENV === "development";
    const frontendUrls = AppConfig.ALLOWED_ORIGINS.split(",")
        .map((url) => url.trim())
        .filter(Boolean);

    app.useStaticAssets(join(__dirname, "..", "public"), {});
    app.use(cookieParser());
    app.getHttpAdapter().getInstance().set("trust proxy", 1);
    app.enableCors({
        origin: (origin, callback) => {
            if (isDevelopment || !origin || frontendUrls.includes(origin)) {
                callback(null, true);
            } else {
                callback(new UnauthorizedException("Not allowed by CORS"));
            }
        },
        credentials: true,
    });

    app.useGlobalFilters(new SpaExceptionFilter());

    if (AppConfig.NODE_ENV !== "production") {
        app.use(new LoggerMiddleware().use);
    }

    await app.listen(AppConfig.PORT, "0.0.0.0");
}

bootstrap();

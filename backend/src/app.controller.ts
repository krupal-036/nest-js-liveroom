// backend/src/app.controller.ts
import { AppConfig } from "@/common/config/AppConfig";
import { Public } from "@/common/decorators/public.decorator";
import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";

@Controller()
export class AppController {
    @Public()
    @Get("health")
    @HttpCode(HttpStatus.OK)
    getHello() {
        return {
            status: "ok",
            code: HttpStatus.OK,
            message: "API is successfully working!",
            timestamp: new Date().toISOString(),
            environment: AppConfig.NODE_ENV,
            current_database: AppConfig.DB_TYPE,
            version: process.env.npm_package_version || "1.0.0",
        };
    }

    @Public()
    @Get("database")
    getDatabaseType(): any {
        return { current_database: AppConfig.DB_TYPE };
    }
}

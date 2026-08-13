import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';
import { AppConfig } from './common/config/AppConfig';
import os from 'node:os';

@Controller()
export class AppController {
    @Public()    
    @Get('health')
    @HttpCode(HttpStatus.OK)
    getHello() {
        return {
            status: "ok",
            code: HttpStatus.OK,
            message: "API is successfully working!",
            timestamp: new Date().toISOString(),
            environment: AppConfig.NODE_ENV,
            current_database: AppConfig.DB_TYPE,
            uptime: `${process.uptime().toFixed(2)} seconds`,
            version: process.env.npm_package_version || "1.0.0",
            system: {
                platform: os.platform(),
                architecture: os.arch(),
                freeMemory: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`,
                totalMemory: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
            }
        };
    }
    
    @Public()
    @Get('database')
    getDatabaseType(): any {
        return { current_database: AppConfig.DB_TYPE };
    }
}

// backend/src/common/middleware/logger.middleware.ts
import { NextFunction, Request, Response } from "express";
import { Injectable, NestMiddleware } from "@nestjs/common";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log(`[MIDDLEWARE ENTRY] ${req.method} ${req.url}`);
        next();
    }
}

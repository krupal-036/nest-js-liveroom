// backend/src/common/filters/spa-exception.filter.ts
import { join } from "path";
import { Response } from "express";
import { ExceptionFilter, Catch, ArgumentsHost, NotFoundException } from "@nestjs/common";

@Catch(NotFoundException)
export class SpaExceptionFilter implements ExceptionFilter {
    catch(exception: NotFoundException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<any>();

        if (
            request.url.startsWith("/api") ||
            request.url.startsWith("/health") ||
            request.url.startsWith("/users")
        ) {
            return response.status(404).json(exception.getResponse());
        }
        const indexPath = join(process.cwd(), "public", "index.html");
        response.sendFile(indexPath);
    }
}

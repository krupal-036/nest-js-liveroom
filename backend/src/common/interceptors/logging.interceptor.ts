import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

export interface Response<T> {
    success: boolean;
    statusCode: number;
    timestamp: string;
    data: T;
}

@Injectable()
export class LoggingInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const { method, url }: { method: string; url: string } = request;

        const startTime = Date.now();

        console.log(`>>> [BEFORE] Incoming Request : ${method} ${url}`);

        return next.handle().pipe(
            tap(() => {
                const endTime = Date.now();
                const duration = endTime - startTime;

                console.log(`<<< [AFTER] Outgoing Request: ${method} ${url} took ${duration}ms `);
            }),
            map((data) => ({
                success: true,
                statusCode: response.statusCode,
                timestamp: new Date().toISOString(),
                data,
            })),
        );
    }
}

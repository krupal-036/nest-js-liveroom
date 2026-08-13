import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        public jwtService: JwtService,
        public reflector: Reflector,
    ) {}

    private getToken(request: Request): string | undefined {
        const authHeader = request.headers['authorization'];
        if (authHeader) {
            const [type, token] = authHeader.split(' ');
            if (type === 'Bearer') return token;
        }
        return request.cookies?.['token'];
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride(PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;

        const request = context.switchToHttp().getRequest<Request>();
        const token = this.getToken(request);

        if (!token) throw new UnauthorizedException({ message: 'No Token Provided' });

        try {
            const payload = await this.jwtService.verifyAsync(token);
            if (payload.isDisabled || payload.isBlacklisted) {
                throw new ForbiddenException('Account is disabled or blacklisted.');
            }
            request['payload'] = payload;
        } catch {
            throw new UnauthorizedException({ message: 'Invalid or Expired Token' });
        }

        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles || requiredRoles.length === 0) return true;

        const hasRole = requiredRoles.some((role) => request['payload'].role === role);
        if (!hasRole)
            throw new ForbiddenException({
                message: 'You do not have permission to access this route.',
            });

        return true;
    }
}

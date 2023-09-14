import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    handleRequest(err, user, info, context) {
        // Log any errors or information related to authentication
        if (err || !user) {
            console.error('JWT Authentication Error:', err || info);
            throw err || new UnauthorizedException('Unauthorized');
        }

        const request = context.switchToHttp().getRequest();
        const allowAny = this.reflector.get<string[]>('allow-any', context.getHandler());

        if (allowAny) return null;

        return user;
    }
}

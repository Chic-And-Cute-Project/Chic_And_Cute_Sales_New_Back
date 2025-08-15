import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any) {
        if (err || !user) {
            throw new UnauthorizedException({
                message: err?.message || 'No estás autorizado para acceder a esta ruta.',
                error: 'Unauthorized',
                statusCode: 401
            });
        }
        return user;
    }
}

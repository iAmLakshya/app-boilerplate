import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

import { FirebaseAuthProvider } from '../../external/firebase/firebase-auth.provider';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authProvider: FirebaseAuthProvider
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // this.logger.debug(`Processing request to ${request.url}`);

    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      // this.logger.debug('Route is public, skipping authentication');
      return true;
    }

    // this.logger.debug('Protected route, validating authentication');
    return this.validateRequest(request);
  }

  private async validateRequest(request: any): Promise<boolean> {
    // Extract token from Authorization header
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      // this.logger.warn('No token provided');
      throw new UnauthorizedException('No authentication token provided');
    }

    try {
      // this.logger.debug('Validating Firebase token');

      // Directly validate the token with Firebase through our auth provider
      const user = await this.authProvider.validateToken(token);

      if (!user) {
        // this.logger.warn('Invalid token or authentication failed');
        throw new UnauthorizedException('Invalid authentication token');
      }

      // Attach the user to the request object
      request.user = user;
      // this.logger.debug(`User ${user.uid} authenticated successfully`);

      return true;
    } catch (error) {
      // this.logger.error(`Authentication failed: ${error.message}`, error.stack);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}

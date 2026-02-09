/**
 * ============================================
 * ARTIVIO — AUTH GUARD
 * ============================================
 */

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // placeholder for JWT/session logic
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException(
        'Unauthorized',
      );
    }

    return true;
  }
}
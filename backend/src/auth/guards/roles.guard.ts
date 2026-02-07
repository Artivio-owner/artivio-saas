/**
 * ============================================
 * ARTIVIO — ROLES GUARD (RBAC)
 * File: roles.guard.ts
 * ============================================
 */

import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  
  /**
   * --------------------------------------------
   * ROLES ENUM (LOGICAL ORDER)
   * --------------------------------------------
   * Higher index = higher privileges
   */
  export enum UserRole {
    INTERN = 'INTERN',          // Стажёр
    MASTER = 'MASTER',          // Мастер
    MANAGER = 'MANAGER',        // Менеджер
    CHIEF_MASTER = 'CHIEF_MASTER', // Главный мастер
    ADMIN = 'ADMIN',            // Администратор компании
    SUPER_ADMIN = 'SUPER_ADMIN', // net_buzz (глобальный)
  }
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      /**
       * --------------------------------------------
       * GET REQUIRED ROLES FROM METADATA
       * --------------------------------------------
       */
      const requiredRoles = this.reflector.get<UserRole[]>(
        'roles',
        context.getHandler(),
      );
  
      // If no roles specified → allow access
      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }
  
      const request = context.switchToHttp().getRequest();
      const user = request.user;
  
      if (!user) {
        throw new ForbiddenException('Access denied');
      }
  
      /**
       * --------------------------------------------
       * SUPER ADMIN BYPASS
       * --------------------------------------------
       * net_buzz can access everything
       */
      if (user.role === UserRole.SUPER_ADMIN) {
        return true;
      }
  
      /**
       * --------------------------------------------
       * ROLE CHECK
       * --------------------------------------------
       */
      if (!requiredRoles.includes(user.role)) {
        throw new ForbiddenException('Insufficient permissions');
      }
  
      return true;
    }
  }
/**
 * ============================================
 * ARTIVIO — ROLES GUARD
 * File: roles.guard.ts
 * ============================================
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthUserType } from './auth.service';
import { EmployeeRole } from '../employees/employees.service';

/**
 * Ключ для декоратора ролей
 */
export const ROLES_KEY = 'roles';

/**
 * Декоратор для указания разрешённых ролей
 * Пример:
 * @Roles(EmployeeRole.ADMIN, EmployeeRole.MANAGER)
 */
export const Roles = (...roles: EmployeeRole[]) =>
  Reflect.metadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<EmployeeRole[]>(
        ROLES_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    // Если роли не указаны — доступ открыт
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Нет доступа');
    }

    /**
     * SUPER_ADMIN (net_buzz)
     * Имеет доступ ко всему и не отображается в компаниях
     */
    if (user.type === AuthUserType.SUPER_ADMIN) {
      return true;
    }

    /**
     * Клиенты не имеют доступа к админским разделам
     */
    if (user.type === AuthUserType.CLIENT) {
      throw new ForbiddenException('Доступ запрещён');
    }

    /**
     * Проверка роли сотрудника
     */
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        'Недостаточно прав для доступа к разделу',
      );
    }

    return true;
  }
}
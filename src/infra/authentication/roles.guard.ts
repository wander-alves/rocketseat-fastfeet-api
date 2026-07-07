import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role, ROLES_KEY } from '@/infra/authentication/roles';

@Injectable()
class RolesGuard implements CanActivate {
  private reflector: Reflector;

  constructor(reflector: Reflector) {
    this.reflector = reflector;
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const { role } = user;

    return requiredRoles.includes(role);
  }
}

export { RolesGuard };

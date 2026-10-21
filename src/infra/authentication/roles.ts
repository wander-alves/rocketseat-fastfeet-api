import { SetMetadata } from '@nestjs/common';

const ROLES_KEY = 'roles';

enum Role {
  COURIER = 'COURIER',
  ADMIN = 'LOGISTICS_SUPPORT',
}

const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export { ROLES_KEY, Roles, Role };

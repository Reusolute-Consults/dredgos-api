import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client'; // Pulls the Enum we defined in Prisma

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
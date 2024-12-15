import { Reflector } from '@nestjs/core';

type ValidRoles = 'admin' | 'user';

export const Roles = Reflector.createDecorator<ValidRoles[]>();

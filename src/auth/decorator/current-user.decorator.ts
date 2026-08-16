import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { AuthenticatedClient } from '../types/authenticated-client';
// This decorator is used to extract the current user from the
// request object in a NestJS application.
// It can be used in controller methods to access the authenticated user's information.
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedClient => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: AuthenticatedClient }>();
    return request.user;
  },
);

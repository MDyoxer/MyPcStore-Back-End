import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// This decorator is used to extract the current user from the
// request object in a NestJS application.
// It can be used in controller methods to access the authenticated user's information.
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest().user;
  },
);

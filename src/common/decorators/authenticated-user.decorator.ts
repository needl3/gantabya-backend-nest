import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { AccessTokenPayload } from "src/auth/dto/login-user.dto";

export interface MaybeAuthenticatedRequest extends Request {
  user?: AccessTokenPayload
}

export const AuthenticatedUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<MaybeAuthenticatedRequest>()

  if (!request.user?.id) throw new UnauthorizedException("User is not authenticated")

  return request.user
})

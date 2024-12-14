import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { Types } from "mongoose";

export type TAuthenticatedUser = { userId: Types.ObjectId }
export interface MaybeAuthenticatedRequest extends Request {
  userId?: Types.ObjectId
}

export const AuthenticatedUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<MaybeAuthenticatedRequest>()

  if (!request.userId) throw new UnauthorizedException("User is not authenticated")

  return { userId: request.userId }
})

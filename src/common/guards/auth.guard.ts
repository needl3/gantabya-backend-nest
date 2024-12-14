import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AccessTokenPayload } from "src/auth/dto/login-user.dto";
import { MaybeAuthenticatedRequest } from "../decorators/authenticated-user.decorator";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<MaybeAuthenticatedRequest>()

    const authorization = request.headers.authorization?.split(' ')[0]
    console.log("Cookies: ", request.cookies, request.headers)
    if (!authorization) throw new UnauthorizedException()

    try {
      const verifiedPayload: AccessTokenPayload = await this.jwtService.verifyAsync(authorization)
      request.userId = verifiedPayload.userId
    } catch (e) {
      throw new UnauthorizedException()
    }

    return true
  }
}

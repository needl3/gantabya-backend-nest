import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AccessTokenPayload } from "src/auth/dto/login-user.dto";
import { MaybeAuthenticatedRequest } from "../decorators/authenticated-user.decorator";
import { ConfigService } from "@nestjs/config";
import { JWT_SECRET_IDENTIFIER } from "../constants/env.constants";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<MaybeAuthenticatedRequest>()

    console.log("Cookies: ", request.cookies)
    const authorization = request.cookies.authorization?.split(' ')[1]
    console.log("Authorization: ", authorization)
    if (!authorization) throw new UnauthorizedException()

    try {
      const verifiedPayload: AccessTokenPayload = await this.jwtService.verifyAsync(authorization,
        { secret: this.configService.get<string>(JWT_SECRET_IDENTIFIER) }
      )
      request.userId = verifiedPayload.userId
    } catch (e) {
      console.error(e)
      throw new UnauthorizedException()
    }

    return true
  }
}

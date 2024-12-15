import { Injectable } from "@nestjs/common";
import { RegisterUserRequestDto, RegisterUserResponseDto } from "./dto/register-user.dto";
import { AccessTokenPayload, LoginUserRequestDto } from "./dto/login-user.dto";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) { }
  async register(userDetails: RegisterUserRequestDto): Promise<RegisterUserResponseDto | null> {
    const previousUser = await this.userService.fetchByEmail(userDetails.email)

    if (!!previousUser) {
      return null
    }

    const user = await this.userService.create(userDetails)

    // TODO: Create a decorator that takes a type and crafts a response object from input object
    return {
      name: user.name,
      email: user.email
    }
  }

  async login(loginDetails: LoginUserRequestDto): Promise<string | null> {
    const userDetails = await this.userService.fetchByEmailAndPassword(loginDetails.email, loginDetails.password)

    if (!userDetails) return null

    return this.createAccessToken({ userId: userDetails._id })
  }

  private async createAccessToken(payload: AccessTokenPayload): Promise<string> {
    return await this.jwtService.signAsync(payload)
  }
}

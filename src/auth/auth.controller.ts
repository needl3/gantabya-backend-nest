import { Body, ConflictException, Controller, Delete, Get, HttpException, HttpStatus, Post, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserRequestDto, RegisterUserResponseDto } from './dto/register-user.dto';
import { AccessTokenPayload, LoginUserRequestDto, LoginUserResponseDto } from './dto/login-user.dto';
import { Response } from 'express';
import { AUTH_FIELD } from 'src/common/constants/auth.constants';
import { AuthenticationGuard } from 'src/common/guards/auth.guard';
import { SessionResponseDto } from './dto/session.dto';
import { AuthenticatedUser } from 'src/common/decorators/authenticated-user.decorator';
import { UserService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { }

  @Post('register')
  async register(@Body() request: RegisterUserRequestDto): Promise<RegisterUserResponseDto> {
    const user = await this.authService.register(request);

    if (!user) throw new ConflictException("User already exists")

    return user
  }

  @Post('login')
  async login(@Body() request: LoginUserRequestDto, @Res({ passthrough: true }) response: Response): Promise<LoginUserResponseDto> {
    const accessToken = await this.authService.login(request);

    if (!accessToken) throw new UnauthorizedException()

    response.cookie(AUTH_FIELD, `Bearer ${accessToken}`)
    return { accessToken }
  }

  @UseGuards(AuthenticationGuard)
  @Get('session')
  async getSession(@AuthenticatedUser() user: AccessTokenPayload): Promise<SessionResponseDto> {
    const userDetails = await this.userService.fetchById(user.id)

    if (!userDetails) throw new HttpException("User not found", HttpStatus.NOT_FOUND)

    return { userId: user.id, role: userDetails.role }
  }

  @Delete('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(AUTH_FIELD)
  }
}

import { Body, ConflictException, Controller, Delete, Get, Post, Request, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserRequestDto, RegisterUserResponseDto } from './dto/register-user.dto';
import { LoginUserRequestDto, LoginUserResponseDto } from './dto/login-user.dto';
import { Response } from 'express';
import { AUTH_FIELD } from 'src/common/constants/auth.constants';
import { AuthenticationGuard } from 'src/common/guards/auth.guard';
import { SessionResponseDto } from './dto/session.dto';
import { AuthenticatedUser, TAuthenticatedUser } from 'src/common/decorators/authenticated-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

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
  async getSession(@AuthenticatedUser() user: TAuthenticatedUser): Promise<SessionResponseDto> {
    return { userId: user.userId }
  }

  @Delete('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(AUTH_FIELD)
  }
}

import type { Response, Request } from 'express';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dtos/register.dto';
import { LoginDTO } from './dtos/login.dto';
import { ResetPasswordDTO } from './dtos/reset-password.dto';
import { ForgotPasswordDTO } from './dtos/forgot-password.dto';
import { UserRole } from 'src/enum';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/me')
  @UseGuards(AdminGuard)
  @Roles(UserRole.ADMIN)
  me(@Req() req) {
    return req.user;
  }

  @Public()
  @Post('/signup')
  signUp(@Body() body: RegisterDTO) {
    return this.authService.signUp(
      body.email,
      body.password,
      body.name,
      body.isAdmin,
    );
  }

  @Public()
  @Post('/signin')
  async signIn(
    @Body() body: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } = await this.authService.signIn(
      body.email,
      body.password,
    );

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return user;
  }

  @Post('/refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const oldRefreshToken = req.cookies['refresh_token'] as string;
    if (!oldRefreshToken) throw new UnauthorizedException();

    const { accessToken, refreshToken } =
      await this.authService.refreshAccessToken(oldRefreshToken);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { message: 'Tokens refreshed' };
  }

  @Post('/signout')
  signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }

  @Public()
  @Post('/forgot-password')
  forgotPassword(@Body() body: ForgotPasswordDTO) {
    return this.authService.forgotPassword(body.email);
  }

  @Public()
  @Post('/reset-password')
  resetPassword(@Query('token') token: string, @Body() body: ResetPasswordDTO) {
    return this.authService.resetPassword(
      token,
      body.password,
      body.confirmPassword,
    );
  }
}

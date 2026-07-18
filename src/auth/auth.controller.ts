import { Controller, Post, Body, Get, UseGuards, Request, UnauthorizedException, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const result = await this.authService.login(user);
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return result;
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const result = await this.authService.register(createUserDto);
    return result;
  }

  @Post('verify-email')
  async verifyEmail(@Body('email') email: string, @Body('otp') otp: string, @Res({ passthrough: true }) res: Response) {
    if (!email || !otp) throw new UnauthorizedException('Email and OTP are required');
    const result = await this.authService.verifyEmail(email, otp);
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return result;
  }

  @Post('resend-otp')
  async resendOtp(@Body('email') email: string) {
    if (!email) throw new UnauthorizedException('Email is required');
    return this.authService.resendOtp(email);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    if (!email) throw new UnauthorizedException('Email is required');
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body('email') email: string,
    @Body('otp') otp: string,
    @Body('newPassword') newPassword: string,
  ) {
    if (!email || !otp || !newPassword) throw new UnauthorizedException('Missing parameters');
    return this.authService.resetPassword(email, otp, newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Request() req,
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    if (!currentPassword || !newPassword) throw new UnauthorizedException('Missing parameters');
    return this.authService.changePassword(req.user.id, currentPassword, newPassword);
  }

  @Post('google')
  async googleLogin(@Body('credential') credential: string, @Res({ passthrough: true }) res: Response) {
    if (!credential) {
      throw new UnauthorizedException('Google credential is required');
    }
    const result = await this.authService.googleLogin(credential);
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return result;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}

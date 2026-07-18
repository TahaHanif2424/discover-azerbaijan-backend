import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateOtpExpiry(): Date {
    return new Date(Date.now() + 10 * 60 * 1000); // 10 mins
  }

  async validateUser(loginDto: LoginDto): Promise<any> {
    const user = await this.userService.findByEmail(loginDto.email);
    if (user && user.password) {
      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
      if (isPasswordValid) {
        if (!user.isEmailVerified) {
          throw new UnauthorizedException('Please verify your email before logging in.');
        }
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const newUser = await this.userService.create(createUserDto);
    
    // Generate and send OTP
    const otp = this.generateOtp();
    const otpExpiry = this.generateOtpExpiry();
    await this.userService.updateOtp(newUser.id, otp, otpExpiry);
    await this.emailService.sendOtpEmail(newUser.email, otp);

    return { message: 'Registration successful. Please verify your email.', email: newUser.email };
  }

  async verifyEmail(email: string, otp: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');
    if (user.isEmailVerified) throw new ConflictException('Email already verified');
    if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    await this.userService.verifyEmail(user.id);
    return this.login(user);
  }

  async resendOtp(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');
    if (user.isEmailVerified) throw new ConflictException('Email already verified');

    const otp = this.generateOtp();
    const otpExpiry = this.generateOtpExpiry();
    await this.userService.updateOtp(user.id, otp, otpExpiry);
    await this.emailService.sendOtpEmail(user.email, otp);

    return { message: 'OTP resent successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) return { message: 'If that email exists, an OTP has been sent.' }; // Prevent email enumeration

    const otp = this.generateOtp();
    const otpExpiry = this.generateOtpExpiry();
    await this.userService.updateOtp(user.id, otp, otpExpiry);
    await this.emailService.sendPasswordResetEmail(user.email, otp);

    return { message: 'If that email exists, an OTP has been sent.' };
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid or expired OTP');
    if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userService.updatePassword(user.id, hashedPassword);

    return { message: 'Password reset successful' };
  }

  async changePassword(userId: string, currentPass: string, newPass: string) {
    const user = await this.userService.findOne(userId);
    if (!user || !user.password) throw new UnauthorizedException('Invalid user');

    const isMatch = await bcrypt.compare(currentPass, user.password);
    if (!isMatch) throw new UnauthorizedException('Incorrect current password');

    const hashedPassword = await bcrypt.hash(newPass, 10);
    await this.userService.updatePassword(user.id, hashedPassword);

    return { message: 'Password changed successfully' };
  }

  async googleLogin(credential: string) {
    try {
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID');
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
      });
      const payload = ticket.getPayload();
      
      if (!payload || !payload.email) {
        throw new UnauthorizedException('Invalid Google token');
      }

      let user = await this.userService.findByEmail(payload.email);
      
      if (!user) {
        // Create new user without a password since they registered via Google
        // We'll use a random placeholder string for the password because createUserDto might require it, 
        // or we bypass it by calling prisma directly. Let's see how create works. 
        // Since createUserDto might require a password, let's pass an empty string or a random one.
        // Actually, since we made password optional in the DB, we can just use prisma here if the service limits us.
        // But userService.create expects CreateUserDto. Let's use a random secure password.
        const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
        
        user = await this.userService.create({
          name: payload.name || payload.email.split('@')[0],
          email: payload.email,
          password: randomPassword,
          role: 'USER',
        });
        // Google users are automatically verified
        await this.userService.verifyEmail(user.id);
      } else if (!user.isEmailVerified) {
        // If the user registered manually but hasn't verified, verify them since they used Google now
        await this.userService.verifyEmail(user.id);
      }

      return this.login(user);
    } catch (error) {
      console.error('Google login error:', error);
      throw new UnauthorizedException('Failed to authenticate with Google');
    }
  }
}

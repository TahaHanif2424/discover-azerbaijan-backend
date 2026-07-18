import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<any> {
    const user = await this.userService.findByEmail(loginDto.email);
    if (user && user.password) {
      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
      if (isPasswordValid) {
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
    return this.login(newUser);
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
      }

      return this.login(user);
    } catch (error) {
      console.error('Google login error:', error);
      throw new UnauthorizedException('Failed to authenticate with Google');
    }
  }
}

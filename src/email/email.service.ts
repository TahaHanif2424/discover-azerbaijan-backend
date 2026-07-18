import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendOtpEmail(to: string, otp: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Discover Azerbaijan - Your OTP Verification Code',
        text: `Your verification code is: ${otp}. This code will expire in 10 minutes.`,
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Welcome to Discover Azerbaijan!</h2>
            <p>Your verification code is:</p>
            <h1 style="font-size: 32px; letter-spacing: 4px; color: #5DADC9;">${otp}</h1>
            <p>This code will expire in 10 minutes. Please do not share it with anyone.</p>
          </div>
        `,
      });
      console.log(`OTP sent to ${to}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Could not send verification email');
    }
  }

  async sendPasswordResetEmail(to: string, otp: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Discover Azerbaijan - Password Reset Code',
        text: `Your password reset code is: ${otp}. This code will expire in 10 minutes.`,
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Password Reset Request</h2>
            <p>You requested to reset your password. Use the following code:</p>
            <h1 style="font-size: 32px; letter-spacing: 4px; color: #D9534F;">${otp}</h1>
            <p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
          </div>
        `,
      });
      console.log(`Password reset OTP sent to ${to}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Could not send password reset email');
    }
  }
}

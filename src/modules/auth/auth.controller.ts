import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { LoginDto } from './dtos/LoginDto.dto';
// "/api/v1/auth/**"
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('email/register')
  @HttpCode(HttpStatus.OK)
  async register(@Req() req: Request) {
    await this.authService.sendMail();
    return 'OK';
  }
  @Post('email/login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const response = await this.authService.validateLogin(loginDto);
      return {
        message: 'LOGIN.SUCCESS',
        status: 200,
        data: response,
      };
    } catch (error) {
      return {
        message: error.response,
        status: error.status,
        data: [],
      };
    }
    // login user: email-string, password-string
  }
  @Get('email/logout')
  async logout() {
    // logout
  }
  @Get('email/verify/:token')
  async verifyToken(@Param('token') token: string) {
    return 'OK checked';
  }
  @Get('email/resend-verification/:email')
  async resendVerification() {
    // resend verification email
  }
  @Get('email/forgot-password/:email')
  async fotgotPassword() {
    // send a token via email to reset the password
  }
  @Post('email/reset-password')
  async resetPassword() {
    // change the userpassword. newPassword-string, newPasswordToken-string (token received by fotgot-password api)
  }
}

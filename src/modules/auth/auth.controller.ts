import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginDto } from './dtos/LoginDto.dto';
import { RegisterDto } from './dtos/RegisterDto.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { EmailDto } from './dtos/EmailDto.dto';
// "/api/v1/auth/**"
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  @Post('email/register')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    try {
      await this.authService.performRegister(registerDto);
      res.status(200).json({
        message: 'Registration Successfully',
        status: 'SUCCESS',
      });
    } catch (error) {
      this.logger.error('Calling register()', error, AuthController.name);
      throw error;
    }
  }

  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  async login(@Res() res: Response, @Body() loginDto: LoginDto) {
    try {
      const response = await this.authService.validateLogin(loginDto);
      res.status(200).json({
        message: 'Login Successfully',
        status: 'SUCCESS',
        data: response,
      });
    } catch (error) {
      this.logger.error('Calling login()', error, AuthController.name);
      throw error;
    }
  }
  @Get('email/logout')
  async logout() {
    // logout
  }
  @Get('email/verify/:token')
  async verifyToken(@Param('token') token: string, @Res() res: Response) {
    try {
      await this.authService.verifyToken(token);
      res.status(200).json({
        message: 'Email verification successfully',
        status: 'SUCCESS',
      });
    } catch (error) {
      this.logger.error('Calling verifyToken()', error, AuthController.name);
      throw error;
    }
  }
  @Post('email/resend-verification')
  @UsePipes(new ValidationPipe())
  async resendVerification(@Body() emailDTO: EmailDto, @Res() res: Response) {
    try {
      await this.authService.resendEmail(emailDTO.email);
      res.status(200).json({
        message: 'Resend email verification successfully',
        status: 'SUCCESS',
      });
    } catch (error) {
      this.logger.error(
        'Calling resendVerification()',
        error,
        AuthController.name,
      );
      throw error;
    }
  }
  @Get('email/forgot-password/:email')
  @UsePipes(new ValidationPipe())
  async fotgotPassword(@Param() emailDTO: EmailDto, @Res() res: Response) {
    // send a token via email to reset the password
    try {
      await this.authService.forgotPass(emailDTO);
      res.status(200).json({
        message: 'Send reset password email verification successfully',
        status: 'SUCCESS',
      });
    } catch (error) {
      this.logger.error('Calling fotgotPassword()', error, AuthController.name);
      throw error;
    }
  }
  @Post('email/reset-password')
  async resetPassword() {
    // change the userpassword. newPassword-string, newPasswordToken-string (token received by fotgot-password api)
  }
}

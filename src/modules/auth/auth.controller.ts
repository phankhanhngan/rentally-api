import {
  BadRequestException,
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
import { CheckCodeDto } from './dtos/CheckCodeDto.dto';
import { ResetPasswordDto } from './dtos/ResetPasswordDto.dto';
import { error } from 'console';
import { OAuth2Client } from './google_client/google-client.config';
import { IUserAuthen } from './interfaces/auth-user.interface';
// "/api/v1/auth/**"
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly oauth2Client: OAuth2Client,
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

  @Post('/google/callback')
  async googleAuthCallback(@Body() body, @Res() res: Response) {
    try {
      const { accessToken } = body;
      if (!accessToken) {
        throw new BadRequestException('Access Token can not be null');
      }
      const { id, email, name, picture } = await this.oauth2Client.getInfo(
        accessToken,
      );
      const user: IUserAuthen = {
        googleId: id,
        email,
        firstName: name,
        photo: picture,
      };
      const response = await this.authService.validateGoogleLogin(user);
      res.status(200).json({
        message: 'Login Successfully',
        status: 'SUCCESS',
        data: response,
      });
    } catch (err) {
      this.logger.error(
        'Calling googleAuthCallback()',
        err,
        AuthController.name,
      );
      throw error;
    }
  }

  @Post('email/verify')
  async verifyToken(@Body() checkDto: CheckCodeDto, @Res() res: Response) {
    try {
      if (await this.authService.verifyToken(checkDto)) {
        res.status(200).json({
          message: 'Email verification successfully',
          status: 'SUCCESS',
        });
      }
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
      const token = await this.authService.forgotPass(emailDTO);
      res.status(200).json({
        message: 'Send reset password email verification successfully',
        status: 'SUCCESS',
        // data: token,
      });
    } catch (error) {
      this.logger.error('Calling fotgotPassword()', error, AuthController.name);
      throw error;
    }
  }

  @Post('email/forgot-password/verify')
  @UsePipes(new ValidationPipe())
  async checkVerificationCode(
    @Body() checkDto: CheckCodeDto,
    @Res() res: Response,
  ) {
    try {
      if (await this.authService.checkResetPssVerificationCode(checkDto)) {
        res.status(200).json({
          message: 'Valid verification code',
          status: 'SUCCESS',
        });
      }
    } catch (error) {
      this.logger.error(
        'Calling checkVerificationCode()',
        error,
        AuthController.name,
      );
      throw error;
    }
  }

  @Post('email/reset-password')
  @UsePipes(new ValidationPipe())
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res() res: Response,
  ) {
    try {
      await this.authService.resetPassword(resetPasswordDto);
      res.status(200).json({
        message: 'Reset password successfully',
        status: 'SUCCESS',
      });
    } catch (error) {
      this.logger.error('Calling resetPassword()', error, AuthController.name);
      throw error;
    }
  }
}

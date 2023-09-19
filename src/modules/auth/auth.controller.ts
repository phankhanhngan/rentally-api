import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { LoginDto } from './dtos/LoginDto.dto';
import { RegisterDto } from './dtos/RegisterDto.dto';
import { UsersService } from '../users/users.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { plainToInstance } from 'class-transformer';
import { UserDTO } from '../users/dtos/user.dto';
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
      // console.log(plainToInstance(UserDTO, registerDto));
      await this.authService.performRegister(registerDto);
      res.status(200).json({
        message: 'OK',
        status: 'Registration Successfully',
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
    // login user: email-string, password-string
  }

  // @Post('email/finish-register')
  // @HttpCode(HttpStatus.OK)
  // @UsePipes(new ValidationPipe())
  // async finishRegister(
  //   @Body() registerDto: FinishRegisterDto,
  //   @Res() res: Response,
  // ) {
  //   try {
  //     await this.authService.finishRegister(registerDto);
  //     res.status(200).json({
  //       message: 'OK',
  //       status: 'FINISH.REGISTER.SUCCESS',
  //       data: [],
  //     });
  //     return;
  //   } catch (error) {
  //     res.status(200).json({
  //       message: error,
  //       status: 'FINISH.REGISTER.FAIL',
  //       data: [],
  //     });
  //   }
  // }

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
        data: token,
      });
    } catch (error) {
      this.logger.error('Calling verifyToken()', error, AuthController.name);
      throw error;
    }
  }
  @Post('email/resend-verification')
  @UsePipes(new ValidationPipe())
  async resendVerification(@Body() emailDTO: EmailDto, @Res() res: Response) {
    // resend verification email
    try {
      // console.log(emailDTO);
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
  async fotgotPassword() {
    // send a token via email to reset the password
  }
  @Post('email/reset-password')
  async resetPassword() {
    // change the userpassword. newPassword-string, newPasswordToken-string (token received by fotgot-password api)
  }
}

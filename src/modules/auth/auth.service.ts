import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';
import { LoginDto } from './dtos/LoginDto.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { RegisterDto } from './dtos/RegisterDto.dto';
import { UsersService } from '../users/users.service';
import { UserDTO } from '../users/dtos/user.dto';
import { UserRtnDto } from './dtos/UserRtnDto.dto';
import { EmailDto } from './dtos/EmailDto.dto';
import { CheckCodeDto } from './dtos/CheckCodeDto.dto';
import { ResetPasswordDto } from './dtos/ResetPasswordDto.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from 'src/entities';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly em: EntityManager,
    private readonly userService: UsersService,
    private readonly mailerService: MailerService,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}
  async sendMailConfirm(email: string, code: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Account confirmation - Rentally Team',
        template: './verification',
        context: {
          name: email.split('@')[0],
          code: code,
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async validateLogin(loginDto: LoginDto) {
    try {
      const userDb = await this.userService.getUserByEmail(loginDto.email);
      if (!userDb)
        throw new HttpException(
          'Invalid email or password',
          HttpStatus.NOT_FOUND,
        );
      if (!userDb.verificationCode)
        throw new HttpException(
          'Email has not been verified',
          HttpStatus.FORBIDDEN,
        );
      if (!userDb.isEnable)
        throw new HttpException('User are disabled', HttpStatus.FORBIDDEN);
      var isValidPass = await bcrypt.compare(
        loginDto.password,
        userDb.password,
      );
      const user: UserRtnDto = plainToInstance(UserRtnDto, userDb);
      if (isValidPass) {
        var accessToken = await this.jwtService.signAsync({
          ...user,
        });
        return {
          token: accessToken,
        };
      } else {
        throw new HttpException(
          'Invalid email or password',
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      throw error;
    }
  }
  async performRegister(dto: RegisterDto) {
    try {
      var verificationCode = 'R-' + this.randomFixedInteger(6);
      var verificationToken = await this.jwtService.signAsync({
        email: dto.email,
        code: verificationCode,
        expiry: new Date(
          new Date().getTime() + parseInt(process.env.MAIL_EXPIRATION_TIME),
        ), // 15 mins
      });
      dto.verificationCode = verificationToken;
      await this.userService.addUser(
        plainToInstance(UserDTO, dto),
        null,
        false,
      );
      this.sendMailConfirm(dto.email, verificationCode);
    } catch (error) {
      throw error;
    }
  }

  async resendEmail(email: string) {
    try {
      const userDb = await this.userService.getUserByEmail(email);
      if (!userDb)
        throw new HttpException('Invalid email', HttpStatus.NOT_FOUND);
      // if (userDb.verificationCode)
      //   throw new HttpException(
      //     'Email has been verified',
      //     HttpStatus.FORBIDDEN,
      //   );
      // if (!userDb.isEnable)
      //   throw new HttpException('User are disabled', HttpStatus.FORBIDDEN);
      var verificationCode = 'R-' + this.randomFixedInteger(6);
      var verificationToken = await this.jwtService.signAsync({
        email: email,
        code: verificationCode,
        expiry: new Date(
          new Date().getTime() + parseInt(process.env.MAIL_EXPIRATION_TIME),
        ), // 15 mins
      });
      userDb.verificationCode = verificationToken;
      await this.em.persistAndFlush(userDb);
      this.sendMailConfirm(userDb.email, verificationCode);
    } catch (error) {
      throw error;
    }
  }
  async verifyToken(checkDto: CheckCodeDto) {
    try {
      const userDb = await this.userService.getUserByEmail(checkDto.email);
      if (userDb.isEnable)
        throw new HttpException(
          'Email has been verified',
          HttpStatus.FORBIDDEN,
        );
      const objToken = this.jwtService.decode(userDb.verificationCode);
      if (new Date(objToken['expiry']) > new Date()) {
        if (objToken['code'] === checkDto.code) {
          userDb.isEnable = true;
          await this.em.persistAndFlush(userDb);
          return true;
        } else {
          throw new HttpException(
            'Invalid verification code',
            HttpStatus.NOT_FOUND,
          );
        }
      } else {
        throw new HttpException('Code is expired', HttpStatus.NOT_ACCEPTABLE);
      }
    } catch (error) {
      throw error;
    }
  }
  async forgotPass(emailDTO: EmailDto) {
    try {
      const userDb = await this.userService.getUserByEmail(emailDTO.email);
      if (!userDb.verificationCode)
        throw new HttpException(
          'Email has not been verified',
          HttpStatus.FORBIDDEN,
        );
      if (!userDb.isEnable)
        throw new HttpException('User are disabled', HttpStatus.FORBIDDEN);
      var verificationCode = 'R-' + this.randomFixedInteger(6);
      var verificationToken = await this.jwtService.signAsync({
        email: emailDTO.email,
        code: verificationCode,
        expiry: new Date(
          new Date().getTime() +
            parseInt(process.env.MAIL_FORGOT_PASS_EXPIRATION_TIME),
        ), // 15 mins
      });
      userDb.verificationCode = verificationToken;
      await this.em.persistAndFlush(userDb);
      this.sendMailForgotPass(
        userDb.email,
        userDb.lastName + ' ' + userDb.firstName,
        verificationCode,
      );
      return verificationToken;
    } catch (error) {
      throw error;
    }
  }
  async sendMailForgotPass(
    email: string,
    fName: string,
    verificationCode: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Forgot Password Confirmation Code - Rentally Team',
      template: './reset_password',
      context: {
        name: fName,
        code: verificationCode,
      },
    });
  }
  async checkResetPssVerificationCode(checkDto: CheckCodeDto) {
    try {
      const userDb = await this.userService.getUserByEmail(checkDto.email);
      const objToken = this.jwtService.decode(userDb.verificationCode);
      if (new Date(objToken['expiry']) > new Date()) {
        if (objToken['code'] === checkDto.code) {
          return true;
        } else {
          throw new HttpException(
            'Invalid verification code',
            HttpStatus.NOT_FOUND,
          );
        }
      } else {
        throw new HttpException('Code is expired', HttpStatus.NOT_ACCEPTABLE);
      }
    } catch (error) {
      throw error;
    }
  }
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const userDb = await this.userService.getUserByEmail(
        resetPasswordDto.email,
      );
      const objToken = this.jwtService.decode(userDb.verificationCode);
      if (objToken['code'] === resetPasswordDto.code) {
        userDb.password = await this.userService.hashPassword(
          resetPasswordDto.password,
        );
        await this.em.persistAndFlush(userDb);
      } else {
        throw new HttpException('Code is invalid', HttpStatus.NOT_ACCEPTABLE);
      }
    } catch (error) {
      throw error;
    }
  }
  randomFixedInteger(length: number) {
    return Math.floor(
      Math.pow(10, length - 1) +
        Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1),
    );
  }

  async getUserByEmail(email: string) {
    try {
      const userDb = await this.userRepository.findOne({ email: email });
      if (!userDb) throw new UnauthorizedException('Please log in to continue');
      return plainToInstance(UserRtnDto, userDb);
    } catch (error) {
      throw error;
    }
  }
}

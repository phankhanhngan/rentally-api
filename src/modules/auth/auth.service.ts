import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import { IUserAuthen } from './interfaces/auth-user.interface';
import { UserStatus } from 'src/common/enum/common.enum';
import { UpdateUserDTO } from '../users/dtos/update-user.dto';
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
  async sendMail(
    email: string,
    code: string,
    name: string,
    template: string,
    subject: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: subject,
        template: template,
        context: {
          name: name,
          code: code,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async validateGoogleLogin(user: IUserAuthen) {
    try {
      const userDb = await this.getUserByEmail(user.email);
      if (userDb && userDb.status === UserStatus.DISABLED)
        throw new HttpException('User are disabled', HttpStatus.FORBIDDEN);
      if (!userDb) {
        await this.userService.addUser(plainToInstance(UserDTO, user), null, 0);
      } else {
        if (!userDb.googleId) {
          userDb.googleId = user.googleId;
          await this.em.persistAndFlush(userDb);
        }
      }
      const userRtn: UserRtnDto = plainToInstance(
        UserRtnDto,
        await this.userService.getUserByEmail(user.email),
      );
      const accessToken = await this.jwtService.signAsync({
        ...userRtn,
      });
      return {
        token: accessToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async validateLogin(loginDto: LoginDto) {
    try {
      const userDb = await this.getUserByEmail(loginDto.email);
      if (!userDb)
        throw new HttpException(
          'Invalid email or password',
          HttpStatus.BAD_REQUEST,
        );
      if (!userDb.verificationCode)
        throw new HttpException(
          'Email has not been verified',
          HttpStatus.BAD_REQUEST,
        );
      if (userDb.status === UserStatus.DISABLED)
        throw new HttpException('User are disabled', HttpStatus.BAD_REQUEST);
      const isValidPass = await bcrypt.compare(
        loginDto.password,
        userDb.password,
      );
      const user: UserRtnDto = plainToInstance(UserRtnDto, userDb);
      if (isValidPass) {
        const accessToken = await this.jwtService.signAsync({
          ...user,
        });
        return {
          token: accessToken,
        };
      } else {
        throw new HttpException(
          'Invalid email or password',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw error;
    }
  }

  checkIsRegister(userDb: User) {
    return userDb && userDb.status === UserStatus.REGISTING;
  }

  async performRegister(dto: RegisterDto) {
    try {
      const userDb = await this.getUserByEmail(dto.email);
      const { verificationCode, verificationToken } =
        await this.generateVerificationCode(
          6,
          dto.email,
          parseInt(process.env.MAIL_EXPIRATION_TIME),
        );
      dto.verificationCode = verificationToken;
      if (this.checkIsRegister(userDb)) {
        const updateDto = plainToInstance(UpdateUserDTO, userDb);
        updateDto.status = UserStatus.REGISTING;
        await this.userService.updateUser(
          userDb.id,
          plainToInstance(UpdateUserDTO, userDb),
          null,
          0,
        );
      } else {
        await this.userService.addUser(
          plainToInstance(UserDTO, dto),
          null,
          0,
          UserStatus.REGISTING,
        );
      }
      this.sendMail(
        dto.email,
        verificationCode,
        dto.email.split('@')[0],
        './verification',
        'Account confirmation - Rentally Team',
      );
    } catch (error) {
      throw error;
    }
  }

  async resendEmail(email: string) {
    try {
      const userDb = await this.userService.getUserByEmail(email);
      if (!userDb)
        throw new HttpException('Invalid email', HttpStatus.BAD_REQUEST);
      if (userDb.status === UserStatus.ACTIVE)
        throw new HttpException(
          'Email has been verified',
          HttpStatus.BAD_REQUEST,
        );
      const { verificationCode, verificationToken } =
        await this.generateVerificationCode(
          6,
          email,
          parseInt(process.env.MAIL_EXPIRATION_TIME),
        );
      userDb.verificationCode = verificationToken;
      await this.em.persistAndFlush(userDb);
      this.sendMail(
        userDb.email,
        verificationCode,
        userDb.firstName + ' ' + userDb.lastName,
        './verification',
        'Account confirmation - Rentally Team',
      );
    } catch (error) {
      throw error;
    }
  }
  async verifyLoginToken(checkDto: CheckCodeDto) {
    try {
      const userDb = await this.userService.getUserByEmail(checkDto.email);
      if (userDb.status == UserStatus.ACTIVE)
        throw new HttpException(
          'Email has been verified',
          HttpStatus.BAD_REQUEST,
        );
      const objToken = this.jwtService.decode(userDb.verificationCode);
      if (new Date(objToken['expiry']) < new Date()) {
        throw new HttpException('Code is expired', HttpStatus.BAD_REQUEST);
      }
      if (objToken['code'] === checkDto.code) {
        userDb.status = UserStatus.ACTIVE;
        await this.em.persistAndFlush(userDb);
        const userRtn: UserRtnDto = plainToInstance(UserRtnDto, userDb);
        const accessToken = await this.jwtService.signAsync({
          ...userRtn,
        });
        return {
          token: accessToken,
        };
      } else {
        throw new HttpException(
          'Invalid verification code',
          HttpStatus.BAD_REQUEST,
        );
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
          HttpStatus.BAD_REQUEST,
        );
      if (userDb.status === UserStatus.DISABLED)
        throw new HttpException('User are disabled', HttpStatus.BAD_REQUEST);
      const { verificationCode, verificationToken } =
        await this.generateVerificationCode(
          6,
          emailDTO.email,
          parseInt(process.env.MAIL_FORGOT_PASS_EXPIRATION_TIME),
        );
      userDb.verificationCode = verificationToken;
      await this.em.persistAndFlush(userDb);
      this.sendMail(
        userDb.email,
        verificationCode,
        userDb.firstName + ' ' + userDb.lastName,
        './reset_password',
        'Reset Password Confimation - Rentally Team',
      );
      return verificationToken;
    } catch (error) {
      throw error;
    }
  }

  async verifyResetPassToken(checkDto: CheckCodeDto) {
    try {
      const userDb = await this.userService.getUserByEmail(checkDto.email);
      const objToken = this.jwtService.decode(userDb.verificationCode);
      if (new Date(objToken['expiry']) < new Date()) {
        throw new HttpException('Code is expired', HttpStatus.BAD_REQUEST);
      }
      if (objToken['code'] === checkDto.code) {
        userDb.status = UserStatus.ACTIVE;
        await this.em.persistAndFlush(userDb);
        return true;
      } else {
        throw new HttpException(
          'Invalid verification code',
          HttpStatus.BAD_REQUEST,
        );
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
        throw new HttpException('Code is invalid', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw error;
    }
  }
  async generateVerificationCode(length: number, email: string, exp: number) {
    const verificationCode =
      'R-' +
      Math.floor(
        Math.pow(10, length - 1) +
          Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1),
      );
    const verificationToken = await this.jwtService.signAsync({
      email: email,
      code: verificationCode,
      expiry: new Date(new Date().getTime() + exp),
    });
    return { verificationCode, verificationToken };
  }

  async getUserByEmail(email: string) {
    try {
      const userDb = await this.userRepository.findOne({ email: email });
      return userDb;
    } catch (error) {
      throw error;
    }
  }
}

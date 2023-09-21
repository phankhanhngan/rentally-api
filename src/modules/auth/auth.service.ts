import { EntityManager } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';
import { LoginDto } from './dtos/LoginDto.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { RegisterDto } from './dtos/RegisterDto.dto';
import { UsersService } from '../users/users.service';
import { UserDTO } from '../users/dtos/user.dto';
import { UserRtnDto } from './dtos/UserRtnDto.dto';
import { EmailDto } from './dtos/EmailDto.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly em: EntityManager,
    private readonly userService: UsersService,
    private readonly mailerService: MailerService, // @InjectRepository(User) // private readonly userRepository: EntityRepository<User>,
  ) {}
  async sendMailConfirm(email: string) {
    try {
      var verificationToken = await this.jwtService.signAsync({
        email: email,
        expiry: new Date(
          new Date().getTime() + parseInt(process.env.MAIL_EXPIRATION_TIME),
        ), // 15 mins
      });
      await this.mailerService.sendMail({
        to: email,
        subject: 'Account confirmation - Rentally Team',
        template: './verification',
        context: {
          name: email.split('@')[0],
          url:
            process.env.HOST_URL +
            '/api/v1/auth/email/verify/' +
            verificationToken,
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
      if (isValidPass) {
        var accessToken = await this.jwtService.signAsync({
          user: plainToInstance(UserRtnDto, userDb),
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
      await this.userService.addUser(
        plainToInstance(UserDTO, dto),
        null,
        false,
      );
      this.sendMailConfirm(dto.email);
    } catch (error) {
      throw error;
    }
  }

  async resendEmail(email: string) {
    try {
      const userDb = await this.userService.getUserByEmail(email);
      if (!userDb)
        throw new HttpException('Invalid email', HttpStatus.NOT_FOUND);
      if (userDb.verificationCode)
        throw new HttpException(
          'Email has been verified',
          HttpStatus.FORBIDDEN,
        );
      if (!userDb.isEnable)
        throw new HttpException('User are disabled', HttpStatus.FORBIDDEN);
      await this.sendMailConfirm(userDb.email);
    } catch (error) {
      throw error;
    }
  }
  async verifyToken(token: string) {
    try {
      const objToken = this.jwtService.decode(token);
      if (new Date(objToken['expiry']) > new Date()) {
        const user = await this.userService.getUserByEmail(objToken['email']);
        if (!user.verificationCode) {
          user.verificationCode = token;
          user.isEnable = true;
        } else {
          throw new HttpException(
            'You are already verificated',
            HttpStatus.NOT_ACCEPTABLE,
          );
        }
        await this.em.persistAndFlush(user);
      } else {
        throw new HttpException('Link is expired', HttpStatus.NOT_ACCEPTABLE);
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
      this.sendMailForgotPass(
        userDb.email,
        userDb.lastName + ' ' + userDb.firstName,
      );
    } catch (error) {
      throw error;
    }
  }
  async sendMailForgotPass(email: string, fName: string) {
    var verificationCode = 'R-' + this.randomFixedInteger(6);
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
  randomFixedInteger(length: number) {
    return Math.floor(
      Math.pow(10, length - 1) +
        Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1),
    );
  }
}

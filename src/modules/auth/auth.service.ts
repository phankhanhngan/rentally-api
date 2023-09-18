import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Role, User } from 'src/entities/user.entity';
import { MailerService } from '@nest-modules/mailer';
import { LoginDto } from './dtos/LoginDto.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  instanceToPlain,
  plainToClass,
  plainToInstance,
} from 'class-transformer';
import { RegisterDto } from './dtos/RegisterDto.dto';
import { log } from 'console';
import { UsersService } from '../users/users.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly em: EntityManager,
    private readonly userService: UsersService,
    private readonly mailerService: MailerService, // @InjectRepository(User) // private readonly userRepository: EntityRepository<User>,
  ) {}
  async sendMail(dto: RegisterDto, verificationToken: string) {
    await this.mailerService.sendMail({
      to: dto.email,
      subject: 'Account confirmation - Rentally Team',
      template: './verification',
      context: {
        name: dto.email.split('@')[0],
        url:
          'http://localhost:3003/api/v1/auth/email/verify/' + verificationToken,
      },
    });
  }
  async validateLogin(loginDto: LoginDto) {
    try {
      const userDb = await this.em.findOne(User, {
        email: loginDto.email,
        // isEnable: true,
      });
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
          id: userDb.id,
          role: userDb.role,
        });
        return { token: accessToken, user: plainToInstance(LoginDto, userDb) };
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
      var verificationToken = await this.jwtService.signAsync({
        email: dto.email,
        expiry: new Date(new Date().getTime() + 60 * 15 * 1000),
      });
      await this.registerUser(dto);
      await this.sendMail(dto, verificationToken);
    } catch (error) {
      throw error;
    }
  }
  async registerUser(dto: RegisterDto) {
    try {
      const user = plainToClass(User, dto);
      user.firstName = dto.email.split('@')[0];
      user.password = (
        await this.userService.hashPassword(user.password)
      ).toString();
      user.updated_id = 0;
      user.created_id = 0;
      user.role = Role.USER;
      user.isEnable = false;
      await this.em.persistAndFlush(user);
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
  // async finishRegister(registerDto: FinishRegisterDto) {
  //   try {
  //     const userDB = await this.userService.getUserByEmail(registerDto.email);
  //     userDB.firstName = registerDto.firstName;
  //     userDB.lastName = registerDto.lastName;
  //     userDB.phone_number = registerDto.phone_number;
  //     userDB.role = registerDto.role;
  //     userDB.isEnable = true;
  //     await this.em.persistAndFlush(userDB);
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}

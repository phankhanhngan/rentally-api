import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { MailerService } from '@nest-modules/mailer';
import { LoginDto } from './dtos/LoginDto.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  instanceToPlain,
  plainToClass,
  plainToInstance,
} from 'class-transformer';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly em: EntityManager,
    private readonly mailerService: MailerService, // @InjectRepository(User) // private readonly userRepository: EntityRepository<User>,
  ) {}
  async sendMail() {
    await this.mailerService.sendMail({
      to: 'thinhmnsd2002@gmail.com',
      subject: 'Account confirmation - Rentally Team',
      template: './verification',
      context: {
        name: 'Vo',
        url: 'http://localhost:3003/api/v1/auth/email/verify/sampletoken123',
      },
    });
  }
  async validateLogin(loginDto: LoginDto) {
    try {
      const userDb = await this.em.findOne(User, { email: loginDto.email });
      if (!userDb)
        throw new HttpException(
          'LOGIN.USER_NOT_FOUND_EMAIL',
          HttpStatus.NOT_FOUND,
        );
      if (!userDb.verificationCode)
        throw new HttpException(
          'LOGIN.EMAIL_NOT_VERIFIED',
          HttpStatus.FORBIDDEN,
        );
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
          'LOGIN.USER_NOT_FOUND_PASSWORD',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (error) {
      throw error;
    }
  }
}

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRtnDto } from '../dtos/UserRtnDto.dto';
import { AuthService } from '../auth.service';
import { UserStatus } from 'src/common/enum/common.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: UserRtnDto): Promise<UserRtnDto> {
    try {
      const { email } = payload;
      const userDb = await this.authService.getUserByEmail(email);
      if (!userDb)
        throw new UnauthorizedException('Please log in to continue!');
      if (userDb.status === UserStatus.DISABLED)
        throw new BadRequestException('User are disabled!');
      if (userDb.status === UserStatus.REGISTING)
        throw new BadRequestException('Please active your account!');
      return userDb;
    } catch (error) {
      throw error;
    }
  }
}

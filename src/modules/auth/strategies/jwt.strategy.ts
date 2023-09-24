import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/entities';
import { UserRtnDto } from '../dtos/UserRtnDto.dto';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    // private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: UserRtnDto): Promise<UserRtnDto> {
    try {
      const { email } = payload;
      console.log(payload);
      const user = await this.authService.getUserByEmail(email);
      return user;
    } catch (error) {
      throw error;
    }
  }
}

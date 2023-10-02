import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRtnDto } from '../dtos/UserRtnDto.dto';
import { AuthService } from '../auth.service';
import { plainToInstance } from 'class-transformer';

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
      const userDb = await this.authService.getUserByEmail(email);
      if (!userDb) throw new UnauthorizedException('Please log in to continue');
      return plainToInstance(UserRtnDto, userDb);
    } catch (error) {
      throw error;
    }
  }
}

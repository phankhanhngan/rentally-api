import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CustomAuthGuard extends AuthGuard('jwt') {
  constructor(@Inject(JwtService) readonly jwtService: JwtService) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { authorization: token } = req.headers;
    if (token) {
      const user = this.jwtService.decode(
        token.replace(/^Bearer\s+/, '').replace(/^bearer\s+/, ''),
      );
      req.user = user;
    }
    return true;
  }
}

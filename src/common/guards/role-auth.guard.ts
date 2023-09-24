import { UsersService } from '../../modules/users/users.service';
import {
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  BadRequestException,
  mixin,
} from '@nestjs/common';

export const RoleAuthGuard = (acceptedRoles: Array<string>) => {
  class RoleAuthGuardMixin implements CanActivate {
    constructor(@Inject(UsersService) readonly userService: UsersService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest();
      const user = req.user;
      if (!acceptedRoles.includes(user.role)) {
        throw new HttpException(
          'You are not allow to access to this route',
          HttpStatus.FORBIDDEN,
        );
      }
      return true;
    }
  }

  return mixin(RoleAuthGuardMixin);
};

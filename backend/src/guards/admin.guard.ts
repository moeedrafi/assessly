import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enum';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();

    const { role } = (await this.usersService.findById(
      request.user.sub,
    )) as User;

    if (!requiredRoles.includes(role)) throw new UnauthorizedException();

    return true;
  }
}

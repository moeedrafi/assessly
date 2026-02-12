import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from 'src/enum';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const user = await this.usersService.findById(request.user.sub);
    if (!user) throw new UnauthorizedException();
    if (user.role !== UserRole.ADMIN) throw new ForbiddenException();

    return true;
  }
}

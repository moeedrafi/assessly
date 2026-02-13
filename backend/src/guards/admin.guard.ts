import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from 'src/enum';
@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (!request.user.sub) throw new UnauthorizedException();
    if (request.user.role !== UserRole.ADMIN) throw new ForbiddenException();

    return true;
  }
}

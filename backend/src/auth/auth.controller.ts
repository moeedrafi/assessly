import { Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async createUser() {}

  @Post('/signin')
  async signIn() {}

  @Post('/signout')
  signOut() {}
}

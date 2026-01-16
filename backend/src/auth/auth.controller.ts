import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDTO } from './dtos/register.dto';
import { LoginDTO } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() body: RegisterDTO) {
    return this.authService.signUp(
      body.email,
      body.password,
      body.name,
      body.isAdmin,
    );
  }

  @Post('/signin')
  signIn(@Body() body: LoginDTO) {
    return this.authService.signIn(body.email, body.password);
  }

  @Post('/signout')
  signOut() {
    return this.authService.signOut();
  }
}

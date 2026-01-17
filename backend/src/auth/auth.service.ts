import bcrypt from 'bcrypt';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private async isPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private hashing(password: string) {
    return bcrypt.hash(password, 10);
  }

  async getTokens(id: number, name: string) {
    const payload = { sub: id, name };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1d',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async signUp(
    email: string,
    password: string,
    name: string,
    isAdmin: boolean,
  ) {
    const hashedPassword = await this.hashing(password);

    return this.usersService.create(email, hashedPassword, name, isAdmin);
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.findOne(email);
    if (!user) throw new UnauthorizedException('Invalid user');

    const isCorrect = await this.isPasswordMatch(password, user.password);
    if (!isCorrect) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.getTokens(user.id, user.name);
    const hashedRefreshToken = await this.hashing(tokens.refreshToken);
    await this.usersService.update(user.id, {
      refreshToken: hashedRefreshToken,
    });

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        name: user.name,
      },
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload: { sub: number; name: string } =
        await this.jwtService.verifyAsync(refreshToken, {
          secret: process.env.JWT_REFRESH_SECRET,
        });

      const user = await this.usersService.findById(payload.sub);
      if (!user) throw new NotFoundException('User not found');

      return this.getTokens(user.id, user.name);
    } catch (e) {
      throw new UnauthorizedException(`Invalid or expired refresh token ${e}`);
    }
  }
}

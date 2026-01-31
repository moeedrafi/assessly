import bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { randomBytes, createHash } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly mailService: MailerService,
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
      this.jwtService.signAsync(payload),
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
    const user = await this.usersService.findOne(email);
    if (user) throw new ConflictException('User already exists');

    const hashedPassword = await this.hashing(password);

    // TODO: Send email verification

    return this.usersService.create(email, hashedPassword, name, isAdmin);
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.findOne(email);
    if (!user) throw new UnauthorizedException('Invalid user');

    // TODO: Check email verified

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

  async forgotPassword(email: string) {
    const existingUser = await this.usersService.findOne(email);
    if (!existingUser) throw new NotFoundException('user not found');

    const rawToken = randomBytes(26).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');

    await this.usersService.update(existingUser.id, {
      resetToken: tokenHash,
      resetTokenExpiry: new Date(Date.now() + 1000 * 60 * 10),
    });

    await this.mailService.sendMail({
      from: process.env.SENDER_EMAIL,
      to: existingUser.email,
      subject: `Welcome! Forgot Password? Don't worry`,
      html: `
        <p>Welcome! Please open this link and create a new password:</p>
          <a href="http://localhost:8000/reset-password?token=${rawToken}">
          Reset your password
          </a>
        `,
    });
  }

  async resetPassword(
    token: string,
    password: string,
    confirmPassword: string,
  ) {
    if (password !== confirmPassword)
      throw new BadRequestException('Password dont match');

    const hashedToken = createHash('sha256').update(token).digest('hex');
    const user = await this.usersService.findByResetToken(hashedToken);

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await this.hashing(password);

    await this.usersService.update(user.id, {
      password: hashedPassword,
      resetToken: undefined,
      resetTokenExpiry: undefined,
    });

    return { message: 'password updated' };
  }
}

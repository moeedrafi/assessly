import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  // bcrypt hashing
  signUp(email: string, password: string, name: string, isAdmin: boolean) {
    const user = this.repo.create({ email, isAdmin, password, name });

    return this.repo.save(user);
  }

  // user verified ?
  // bcrypt password compare
  async signIn(email: string, password: string) {
    const user = await this.repo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isCorrect = user.password === password;
    if (!isCorrect) throw new UnauthorizedException('Invalid credentials');

    return {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      name: user.name,
    };
  }

  async signOut() {}
}

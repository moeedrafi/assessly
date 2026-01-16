import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  signUp(email: string, password: string, name: string, isAdmin: boolean) {
    const user = this.repo.create({ email, isAdmin, password, name });

    return this.repo.save(user);
  }

  async signIn() {}

  async signOut() {}
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findOne(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async create(
    email: string,
    password: string,
    name: string,
    isAdmin: boolean,
  ) {
    const user = this.repo.create({
      email,
      isAdmin,
      password,
      name,
    });

    return this.repo.save(user);
  }

  async update(id: number, attr: Partial<User>) {
    const result = await this.repo.update(id, attr);

    if (result.affected === 0) throw new NotFoundException('User not found');
    return result;
  }
}

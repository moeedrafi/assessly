import { Controller, Delete, Get, Patch } from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAllUsers() {}

  @Patch('/:id')
  async updateUser() {}

  @Delete('/:id')
  async removeUser() {}
}

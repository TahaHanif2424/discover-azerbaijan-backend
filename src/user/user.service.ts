import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { createUser, getAllUsers } from './functions';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  create(createUserDto: CreateUserDto) {
    return createUser(this.prisma, createUserDto);
  }

  findAll() {
    return getAllUsers(this.prisma);
  }
}

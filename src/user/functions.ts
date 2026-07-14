import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

export const createUser = async (
  prisma: PrismaService,
  data: CreateUserDto,
) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  return prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
};

export const getAllUsers = async (prisma: PrismaService) => {
  return prisma.user.findMany();
};


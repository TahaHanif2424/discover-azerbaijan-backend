import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

export const createUser = async (
  prisma: PrismaService,
  data: CreateUserDto,
) => {
  return prisma.user.create({
    data,
  });
};

export const getAllUsers = async (prisma: PrismaService) => {
  return prisma.user.findMany();
};

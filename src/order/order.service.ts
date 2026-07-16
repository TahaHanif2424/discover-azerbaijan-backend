import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, tripId: string) {
    return this.prisma.order.create({
      data: {
        userId,
        tripId,
        status: 'pending'
      }
    });
  }
}

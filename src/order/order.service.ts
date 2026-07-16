import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, tripId: string, phone?: string) {
    return this.prisma.order.create({
      data: {
        userId,
        tripId,
        phone,
        status: 'pending'
      }
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        user: true,
        trip: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateStatus(orderId: string, status: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}

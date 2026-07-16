import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body('tripId') tripId: string, @Request() req) {
    const userId = req.user.id;
    return this.orderService.create(userId, tripId);
  }
}

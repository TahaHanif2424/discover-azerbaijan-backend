import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body('tripId') tripId: string, @Body('phone') phone: string, @Request() req) {
    const userId = req.user.id;
    return this.orderService.create(userId, tripId, phone);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/status')
  updateStatus(@Body('status') status: string, @Request() req) {
    const orderId = req.params.id;
    return this.orderService.updateStatus(orderId, status);
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';

@Injectable()
export class TripService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateTripDto, imgPath?: string) {
    return this.prisma.trip.create({
      data: {
        ...createDto,
        img: imgPath,
      },
    });
  }

  async findAll() {
    return this.prisma.trip.findMany({
      include: {
        category: true,
      },
    });
  }
}


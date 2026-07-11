import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTripCategoryDto } from './dto/create-trip-category.dto';

@Injectable()
export class TripCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateTripCategoryDto, imgPath?: string) {
    return this.prisma.tripCategory.create({
      data: {
        ...createDto,
        img: imgPath,
      },
    });
  }

  async findAll() {
    return this.prisma.tripCategory.findMany({
      include: {
        trips: true,
      },
    });
  }
}


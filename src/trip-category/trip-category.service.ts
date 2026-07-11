import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTripCategoryDto } from './dto/create-trip-category.dto';
import { UpdateTripCategoryDto } from './dto/update-trip-category.dto';

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

  async update(id: string, updateDto: UpdateTripCategoryDto, imgPath?: string) {
    // Check if category exists
    const category = await this.prisma.tripCategory.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const dataToUpdate: any = { ...updateDto };
    if (imgPath) {
      dataToUpdate.img = imgPath;
    }

    return this.prisma.tripCategory.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(id: string) {
    const category = await this.prisma.tripCategory.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.prisma.tripCategory.delete({
      where: { id },
    });
  }
}


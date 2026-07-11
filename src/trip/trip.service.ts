import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

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

  async update(id: string, updateDto: UpdateTripDto, imgPath?: string) {
    // Check if trip exists
    const trip = await this.prisma.trip.findUnique({
      where: { id },
    });
    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }

    const dataToUpdate: any = { ...updateDto };
    if (imgPath) {
      dataToUpdate.img = imgPath;
    }

    return this.prisma.trip.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(id: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id },
    });
    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }

    return this.prisma.trip.delete({
      where: { id },
    });
  }
}


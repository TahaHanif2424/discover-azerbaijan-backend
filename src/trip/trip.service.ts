import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@Injectable()
export class TripService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateTripDto, imgPath?: string) {
    const data = { ...createDto, img: imgPath };
    
    // Parse JSON strings if they come from FormData
    if (typeof data.itinerary === 'string') {
      try { data.itinerary = JSON.parse(data.itinerary); } catch (e) {}
    }
    if (typeof data.inclusions === 'string') {
      try { data.inclusions = JSON.parse(data.inclusions); } catch (e) {}
    }
    if (typeof data.pricing === 'string') {
      try { data.pricing = JSON.parse(data.pricing); } catch (e) {}
    }

    return this.prisma.trip.create({
      data,
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

    if (typeof dataToUpdate.itinerary === 'string') {
      try { dataToUpdate.itinerary = JSON.parse(dataToUpdate.itinerary); } catch (e) {}
    }
    if (typeof dataToUpdate.inclusions === 'string') {
      try { dataToUpdate.inclusions = JSON.parse(dataToUpdate.inclusions); } catch (e) {}
    }
    if (typeof dataToUpdate.pricing === 'string') {
      try { dataToUpdate.pricing = JSON.parse(dataToUpdate.pricing); } catch (e) {}
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


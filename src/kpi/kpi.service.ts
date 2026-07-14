import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateKpiDto } from './dto/update-kpi.dto';

@Injectable()
export class KpiService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(startDate?: string, endDate?: string) {
    const where: any = {};
    if (startDate || endDate) {
      where.updatedAt = {};
      if (startDate) {
        where.updatedAt.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.updatedAt.lte = end;
      }
    }

    return this.prisma.kpi.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });
  }

  async update(id: string, updateKpiDto: UpdateKpiDto) {
    const existing = await this.prisma.kpi.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`KPI record with ID ${id} not found`);
    }

    return this.prisma.kpi.update({
      where: { id },
      data: updateKpiDto,
    });
  }
}

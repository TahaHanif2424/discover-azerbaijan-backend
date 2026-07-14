import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateKpiDto } from './dto/update-kpi.dto';

@Injectable()
export class KpiService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.kpi.findMany({
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

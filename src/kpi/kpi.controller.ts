import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { KpiService } from './kpi.service';
import { UpdateKpiDto } from './dto/update-kpi.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('kpi')
@UseGuards(JwtAuthGuard)
export class KpiController {
  constructor(private readonly kpiService: KpiService) {}

  @Get()
  async findAll(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    if (req.user.role === 'user') {
      throw new ForbiddenException('Access denied');
    }
    return this.kpiService.findAll(startDate, endDate);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateKpiDto: UpdateKpiDto,
    @Request() req,
  ) {
    if (req.user.role !== 'marketing') {
      throw new ForbiddenException('Only marketing role is permitted to modify KPIs.');
    }
    return this.kpiService.update(id, updateKpiDto);
  }
}

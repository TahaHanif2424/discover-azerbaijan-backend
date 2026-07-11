import { Controller, Post, Get, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { multerOptions } from '../utils/multer.config';

@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  create(
    @Body() createDto: CreateTripDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const imgPath = file ? `/uploads/${file.filename}` : undefined;
    return this.tripService.create(createDto, imgPath);
  }

  @Get()
  findAll() {
    return this.tripService.findAll();
  }
}


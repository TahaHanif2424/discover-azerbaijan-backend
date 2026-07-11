import { Controller, Post, Get, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TripCategoryService } from './trip-category.service';
import { CreateTripCategoryDto } from './dto/create-trip-category.dto';
import { multerOptions } from '../utils/multer.config';

@Controller('trip-category')
export class TripCategoryController {
  constructor(private readonly tripCategoryService: TripCategoryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  create(
    @Body() createDto: CreateTripCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const imgPath = file ? `/uploads/${file.filename}` : undefined;
    return this.tripCategoryService.create(createDto, imgPath);
  }

  @Get()
  findAll() {
    return this.tripCategoryService.findAll();
  }
}


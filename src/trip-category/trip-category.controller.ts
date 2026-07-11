import { Controller, Post, Get, Patch, Delete, Param, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TripCategoryService } from './trip-category.service';
import { CreateTripCategoryDto } from './dto/create-trip-category.dto';
import { UpdateTripCategoryDto } from './dto/update-trip-category.dto';
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

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTripCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const imgPath = file ? `/uploads/${file.filename}` : undefined;
    return this.tripCategoryService.update(id, updateDto, imgPath);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tripCategoryService.remove(id);
  }
}


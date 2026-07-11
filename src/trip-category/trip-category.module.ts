import { Module } from '@nestjs/common';
import { TripCategoryController } from './trip-category.controller';
import { TripCategoryService } from './trip-category.service';

@Module({
  controllers: [TripCategoryController],
  providers: [TripCategoryService]
})
export class TripCategoryModule {}

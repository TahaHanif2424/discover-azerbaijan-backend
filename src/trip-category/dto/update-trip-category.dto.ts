import { PartialType } from '@nestjs/mapped-types';
import { CreateTripCategoryDto } from './create-trip-category.dto';

export class UpdateTripCategoryDto extends PartialType(CreateTripCategoryDto) {}

import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTripDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  price?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  durationDays?: number;

  @IsString()
  @IsOptional()
  durationText?: string;

  @IsOptional()
  itinerary?: any;

  @IsOptional()
  inclusions?: any;

  @IsOptional()
  pricing?: any;

  @IsString()
  @IsNotEmpty()
  categoryId: string;
}

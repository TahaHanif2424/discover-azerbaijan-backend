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

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  price3Star?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  price4Star?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  price5Star?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  islamabadDepartureAddOn?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  expressVisaAddOn?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;
}

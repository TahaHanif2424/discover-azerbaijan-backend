import { IsOptional, IsString } from 'class-validator';

export class UpdateKpiDto {
  @IsString()
  @IsOptional()
  w1?: string;

  @IsString()
  @IsOptional()
  w2?: string;

  @IsString()
  @IsOptional()
  w3?: string;

  @IsString()
  @IsOptional()
  w4?: string;

  @IsString()
  @IsOptional()
  total?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

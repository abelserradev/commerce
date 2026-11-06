import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  priceAmount!: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsInt()
  @Min(0)
  stockQty!: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

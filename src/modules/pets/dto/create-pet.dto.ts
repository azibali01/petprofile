import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class OwnerDto {
  @ApiProperty()
  @IsString()
  userId!: string;

  @ApiProperty({ enum: ['primary', 'secondary'] })
  @IsEnum(['primary', 'secondary'] as const)
  role!: 'primary' | 'secondary';
}

export class CreatePetDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;

  @ApiProperty({ enum: ['cat', 'dog'] })
  @IsEnum(['cat', 'dog'] as const)
  species!: 'cat' | 'dog';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  breed?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({ enum: ['male', 'female'] })
  @IsEnum(['male', 'female'] as const)
  gender!: 'male' | 'female';

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  profilePhoto?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];

  @ApiPropertyOptional({ type: [OwnerDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OwnerDto)
  owners?: OwnerDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  health?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  behaviour?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  grooming?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

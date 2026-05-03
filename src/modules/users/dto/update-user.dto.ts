import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  profilePhoto?: string;

  @ApiPropertyOptional({ enum: ['primary', 'secondary'] })
  @IsOptional()
  @IsEnum(['primary', 'secondary'] as const)
  role?: 'primary' | 'secondary';

  @ApiPropertyOptional({ enum: ['free', 'basic', 'premium'] })
  @IsOptional()
  @IsEnum(['free', 'basic', 'premium'] as const)
  subscriptionPlan?: 'free' | 'basic' | 'premium';

  @ApiPropertyOptional({ enum: ['active', 'inactive', 'trial'] })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'trial'] as const)
  subscriptionStatus?: 'active' | 'inactive' | 'trial';

  @ApiPropertyOptional()
  @IsOptional()
  pushToken?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  notificationPreferences?: Record<string, boolean>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  streakCount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  rewardPoints?: number;
}

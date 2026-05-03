import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateLogDto {
  @ApiProperty()
  @IsString()
  petId!: string;

  @ApiProperty({
    enum: [
      'meal',
      'walk',
      'mood',
      'behaviour',
      'symptom',
      'medication',
      'vet_visit',
      'grooming',
      'expense',
      'weight',
      'training',
    ],
  })
  @IsEnum(
    [
      'meal',
      'walk',
      'mood',
      'behaviour',
      'symptom',
      'medication',
      'vet_visit',
      'grooming',
      'expense',
      'weight',
      'training',
    ] as const,
  )
  type!:
    | 'meal'
    | 'walk'
    | 'mood'
    | 'behaviour'
    | 'symptom'
    | 'medication'
    | 'vet_visit'
    | 'grooming'
    | 'expense'
    | 'weight'
    | 'training';

  @ApiProperty({ type: Object })
  @IsObject()
  data!: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  voiceTranscript?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  loggedAt?: string;
}

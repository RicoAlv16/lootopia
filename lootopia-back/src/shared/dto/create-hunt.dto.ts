import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsObject,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateHuntDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  duration: number;

  @IsString()
  worldType: string;

  @IsString()
  mode: string;

  @IsNumber()
  maxParticipants: number;

  @IsNumber()
  @IsOptional()
  participationFee?: number;

  @IsBoolean()
  @IsOptional()
  chatEnabled?: boolean;

  @IsBoolean()
  @IsOptional()
  interactiveMap?: boolean;

  @IsObject()
  mapConfig: {
    name: string;
    skin: string;
    zone: string;
    scale: number;
  };

  @IsArray()
  steps: Array<{
    riddle: string;
    validationType: string;
    answer: string;
    hasMap: boolean;
  }>;

  @IsArray()
  @IsOptional()
  landmarks?: Array<{
    name: string;
    latitude: number;
    longitude: number;
    description: string;
  }>;

  @IsObject()
  @IsOptional()
  rewards?: {
    first: number;
    second: number;
    third: number;
  };

  @IsNumber()
  @IsOptional()
  searchDelay?: number;

  @IsNumber()
  @IsOptional()
  searchCost?: number;

  @IsEnum(['active', 'draft', 'private', 'completed'])
  @IsOptional()
  status?: 'active' | 'draft' | 'private' | 'completed';
}

import { IsOptional, IsNumber, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDashboardDataDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: Number, required: false })
  completedHunts?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: Number, required: false })
  huntsGoal?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: Number, required: false })
  artifactsCount?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: Number, required: false })
  totalArtifacts?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  ranking?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: Number, required: false })
  crowns?: number;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: Array, required: false })
  recentActivities?: any[];

  @IsOptional()
  @ApiProperty({ type: Object, required: false })
  progressionData?: any;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: Array, required: false })
  artifactsList?: any[];

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: Array, required: false })
  activeHunts?: any[];

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: Array, required: false })
  badges?: any[];
}

export class UpdateDashboardDataDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: Number, required: false })
  completedHunts?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: Number, required: false })
  huntsGoal?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: Number, required: false })
  artifactsCount?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: Number, required: false })
  totalArtifacts?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  ranking?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: Number, required: false })
  crowns?: number;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: Array, required: false })
  recentActivities?: any[];

  @IsOptional()
  @ApiProperty({ type: Object, required: false })
  progressionData?: any;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: Array, required: false })
  artifactsList?: any[];

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: Array, required: false })
  activeHunts?: any[];

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: Array, required: false })
  badges?: any[];
}

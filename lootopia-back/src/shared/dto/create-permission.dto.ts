import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  permission: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  description: string;
}

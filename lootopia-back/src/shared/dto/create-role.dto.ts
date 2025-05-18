import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreatePermissionDto } from './create-permission.dto';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  role: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePermissionDto)
  @ApiProperty({ type: [CreatePermissionDto] })
  permissions: CreatePermissionDto[];
}

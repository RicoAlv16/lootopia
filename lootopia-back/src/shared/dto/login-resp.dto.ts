import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRespDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  access_token: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  email: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String], description: 'Liste des noms de rôles' })
  roles: string[];

  @IsNumber()
  @ApiProperty({ type: Number })
  id: number;
}

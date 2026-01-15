import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { AuthUserDto } from './auth-user.dto';

export class CreateUserDto extends AuthUserDto {
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  first_name: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  last_name: string;

  @ApiProperty({ example: '123 Main St', description: 'Address of the user' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  address: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number of the user',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  phone_number: string;

  @ApiPropertyOptional({ example: false, description: 'Is the user an admin' })
  @IsBoolean()
  @IsOptional()
  is_admin?: boolean;
}

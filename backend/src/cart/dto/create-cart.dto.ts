import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({
    example: 'c28aa581-a46d-4536-9c13-846b1c25c7c2',
    description: 'The ID of the product',
  })
  @IsString()
  @IsNotEmpty()
  product_id: string;

  @ApiProperty({ example: 2, description: 'The quantity of the product' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

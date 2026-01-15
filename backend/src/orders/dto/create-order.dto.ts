import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: '123 Main St, Springfield, IL 62701',
    description: 'Shipping address for the order',
  })
  @IsString()
  @IsNotEmpty()
  shipping_address: string;

  @ApiProperty({
    example: 'ab0dd9b1-ec74-49a6-9423-4883c9e892ac',
    description: 'UUID of the cart associated with the order',
  })
  @IsString()
  @IsNotEmpty()
  cart_id: string;
}

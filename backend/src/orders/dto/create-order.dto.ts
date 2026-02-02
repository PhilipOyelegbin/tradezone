import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { CreateCartDto } from '../../cart/dto';

export class CreateOrderDto {
  @ApiProperty({
    example: '123 Main St, Springfield, IL 62701',
    description: 'Shipping address for the order',
  })
  @IsString()
  @IsNotEmpty()
  shipping_address: string;

  @ApiProperty({
    example: [
      { product_id: 'uuid-of-cart-1234', quantity: 2 },
      { product_id: 'uuid-of-cart-5678', quantity: 1 },
    ],
    description: 'Array of carts associated with the order',
  })
  @IsArray()
  @IsNotEmpty()
  carts: CreateCartDto[];
}

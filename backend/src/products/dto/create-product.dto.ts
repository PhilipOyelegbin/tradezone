import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Ada Sofa Chair',
    description: 'Name of the product',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Comfortable living room sofa chair',
    description: 'Description of the product',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '200000', description: 'Price of the product' })
  @IsString()
  @IsNotEmpty()
  price: string;

  @ApiProperty({
    example: '167e80be-12ca-4acc-a589-8e5657767bc7',
    description: 'Category ID of the product',
  })
  @IsString()
  @IsNotEmpty()
  category_id: string;

  @ApiProperty({
    example: '20',
    description: 'Available quantity of the product',
  })
  @IsString()
  @IsNotEmpty()
  quantity: string;
}

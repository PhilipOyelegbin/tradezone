import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty({
    description: 'The status of the order',
    example: 'Shipped',
  })
  @IsEnum(['Pending', 'Shipped', 'Delivered', 'Cancelled'], {
    message: 'Status must be one of: Pending, Shipped, Delivered, Cancelled',
  })
  status: string;
}

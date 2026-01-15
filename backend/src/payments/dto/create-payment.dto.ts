import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    example: 'card',
    description:
      'The payment method must be either card, bank, apple_pay, ussd, or qr',
  })
  @IsNotEmpty()
  @IsEnum(['card', 'bank_transfer', 'apple_pay', 'ussd', 'qr'])
  method: 'card' | 'bank_transfer' | 'apple_pay' | 'ussd' | 'qr';

  @ApiProperty({
    example: 'ae028d5b-0b72-4b81-89f4-ccfb8801acd4',
    description: 'The order ID',
  })
  @IsNotEmpty()
  @IsString()
  order_id: string;
}

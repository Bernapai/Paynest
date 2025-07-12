import { IsEnum, IsNumber, IsPositive } from 'class-validator';
import { PaymentCurrency, PaymentProvider } from '../enums/payment-provider.enum';

export class CreatePaymentDto {
    @IsNumber()
    @IsPositive()
    amount: number;

    @IsEnum(PaymentCurrency)
    currency: PaymentCurrency;

    @IsEnum(PaymentProvider)
    provider: PaymentProvider;
}
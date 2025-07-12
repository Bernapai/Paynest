import { Module } from '@nestjs/common';
import { PaymentController } from './payments.controller';
import { PaypalService } from './providers/paypal.service';
import { StripeService } from './providers/stripe.service';

@Module({
  controllers: [PaymentController],
  providers: [PaypalService, StripeService],
})
export class PaymentsModule { }

import { Module } from '@nestjs/common';
import { PaypalWebhookController } from './paypalH/paypal-webhook.controller';
import { StripeWebhookController } from './stripeH/stripe-webhook.controller';
import { PaypalWebhookService } from './paypalH/paypal-webhook.service';
import { StripeWebhookService } from './stripeH/stripe-webhook.service';
@Module({
    controllers: [PaypalWebhookController, StripeWebhookController],
    providers: [PaypalWebhookService, StripeWebhookService],
    exports: []
})
export class UsersModule { }

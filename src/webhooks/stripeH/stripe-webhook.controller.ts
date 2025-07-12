// src/webhook/stripe-webhook.controller.ts
import {
    Controller,
    Post,
    Req,
    Headers,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { StripeWebhookService } from './stripe-webhook.service';

@Controller('webhook/stripe')
export class StripeWebhookController {
    constructor(private readonly stripeWebhookService: StripeWebhookService) { }

    @Post()
    @HttpCode(HttpStatus.OK) // Stripe espera 200 OK si todo está bien
    async handleStripeWebhook(
        @Req() req: Request,
        @Headers('stripe-signature') signature: string,
    ) {
        await this.stripeWebhookService.handleEvent(req.body, signature);
    }
}

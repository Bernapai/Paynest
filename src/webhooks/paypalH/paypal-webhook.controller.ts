// src/webhook/paypal-webhook.controller.ts
import { Controller, Post, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { PaypalWebhookService } from './paypal-webhook.service';
import { Request } from 'express';

@Controller('webhook/paypal')
export class PaypalWebhookController {
    constructor(private readonly paypalWebhookService: PaypalWebhookService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    async handlePaypalWebhook(@Req() req: Request) {
        await this.paypalWebhookService.handleEvent(req);
    }
}

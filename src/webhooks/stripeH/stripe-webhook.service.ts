// src/webhook/stripe-webhook.service.ts
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../../payments/entities/payment.entity';
import { Repository } from 'typeorm';
import { PaymentStatus } from '../../payments/enums/payment-provider.enum';

@Injectable()
export class StripeWebhookService {
    private stripe: Stripe;
    private webhookSecret: string;

    constructor(
        private configService: ConfigService,
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
    ) {
        const secret = this.configService.get<string>('STRIPE_SECRET_KEY');
        if (!secret) {
            throw new Error(' STRIPE_SECRET_KEY no está definido en las variables de entorno');
        }
        this.stripe = new Stripe(secret, {
            apiVersion: '2025-06-30.basil',
        });


        this.webhookSecret = this.configService.getOrThrow('STRIPE_WEBHOOK_SECRET');
    }

    async handleEvent(body: Buffer, signature: string) {
        let event: Stripe.Event;

        try {
            event = this.stripe.webhooks.constructEvent(body, signature!, this.webhookSecret);
        } catch (err) {
            console.error(' Error verificando firma del webhook de Stripe:', err.message);
            throw err;
        }

        const data = event.data.object as Stripe.PaymentIntent;

        switch (event.type) {
            case 'payment_intent.succeeded':
                await this.updatePaymentStatus(data.id, PaymentStatus.COMPLETED);
                break;
            case 'payment_intent.payment_failed':
                await this.updatePaymentStatus(data.id, PaymentStatus.FAILED);
                break;
            case 'payment_intent.canceled':
                await this.updatePaymentStatus(data.id, PaymentStatus.CANCELLED);
                break;
            default:
                console.log(`➡️ Evento no manejado: ${event.type}`);
                break;
        }
    }

    private async updatePaymentStatus(providerPaymentId: string, newStatus: PaymentStatus) {
        const payment = await this.paymentRepository.findOneBy({ providerPaymentId });

        if (!payment) {
            console.warn(`⚠️  No se encontró un pago con ID: ${providerPaymentId}`);
            return;
        }

        payment.status = newStatus;
        await this.paymentRepository.save(payment);

        console.log(`✅ Pago ${payment.id} actualizado a ${newStatus}`);
    }
}

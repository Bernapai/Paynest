// src/payments/providers/stripe.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(private configService: ConfigService) {
        const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
        if (!secretKey) {
            throw new Error('Stripe secret key not found in environment variables');
        }
        this.stripe = new Stripe(secretKey!, {
            apiVersion: '2025-06-30.basil',
        });
    }

    async createPaymentIntent(createPaymentDto: CreatePaymentDto): Promise<Stripe.PaymentIntent> {
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: createPaymentDto.amount * 100,
            currency: createPaymentDto.currency.toLowerCase(),
        });

        return paymentIntent; // Tipo completo
    }

    // Método para confirmar un pago
    async confirmPayment(paymentIntentId: string) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId);
            return paymentIntent;
        } catch (error) {
            throw new Error(`Error confirming payment: ${error.message}`);
        }
    }

    // Método para obtener el estado de un pago
    async getPaymentStatus(paymentIntentId: string) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
            return {
                provider: 'stripe',
                id: paymentIntent.id,
                status: paymentIntent.status,
                amount: paymentIntent.amount / 100,
                currency: paymentIntent.currency,
            };
        } catch (error) {
            throw new Error(`Error getting payment status: ${error.message}`);
        }
    }
}
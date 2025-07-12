// src/webhook/paypal-webhook.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../../payments/entities/payment.entity';
import { PaymentStatus } from '../../payments/enums/payment-provider.enum';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class PaypalWebhookService {
    private readonly clientId: string;
    private readonly clientSecret: string;
    private readonly environment: 'sandbox' | 'live';
    webhookId: string;

    constructor(
        private configService: ConfigService,
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
    ) {
        const clientId = this.configService.get<string>('PAYPAL_CLIENT_ID');
        const clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET');
        const webhookId = this.configService.get<string>('PAYPAL_WEBHOOK_ID');
        const env = this.configService.get<string>('PAYPAL_ENVIRONMENT') || 'sandbox';

        // ✅ Validaciones explícitas
        if (!clientId || !clientSecret || !webhookId) {
            throw new Error('❌ Faltan variables de entorno de PayPal (CLIENT_ID, CLIENT_SECRET o WEBHOOK_ID)');
        }

        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.environment = env === 'live' ? 'live' : 'sandbox';
        this.webhookId = webhookId;
    }

    async handleEvent(req: any) {
        const isValid = await this.verifyWebhook(req);
        if (!isValid) {
            console.warn('⚠️ Webhook de PayPal inválido');
            return;
        }

        const event = req.body;
        console.log(`📦 Evento recibido de PayPal: ${event.event_type}`);

        const resource = event.resource;

        switch (event.event_type) {
            case 'CHECKOUT.ORDER.APPROVED':
            case 'PAYMENT.CAPTURE.COMPLETED':
                await this.updatePaymentStatus(resource.id, PaymentStatus.COMPLETED);
                break;
            case 'PAYMENT.CAPTURE.DENIED':
            case 'PAYMENT.CAPTURE.FAILED':
                await this.updatePaymentStatus(resource.id, PaymentStatus.FAILED);
                break;
            case 'PAYMENT.CAPTURE.REFUNDED':
                await this.updatePaymentStatus(resource.id, PaymentStatus.REFUNDED);
                break;
            default:
                console.log(`➡️ Evento no manejado: ${event.event_type}`);
                break;
        }
    }

    private async updatePaymentStatus(providerPaymentId: string, newStatus: PaymentStatus) {
        const payment = await this.paymentRepository.findOneBy({ providerPaymentId });

        if (!payment) {
            console.warn(`⚠️ No se encontró un pago con ID: ${providerPaymentId}`);
            return;
        }

        payment.status = newStatus;
        await this.paymentRepository.save(payment);
        console.log(`✅ Pago ${payment.id} actualizado a ${newStatus}`);
    }

    private async verifyWebhook(req: any): Promise<boolean> {
        const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

        try {
            const tokenRes = await axios.post(
                `https://api.${this.environment === 'live' ? '' : 'sandbox.'}paypal.com/v1/oauth2/token`,
                'grant_type=client_credentials',
                {
                    headers: {
                        Authorization: `Basic ${auth}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                },
            );

            const token = tokenRes.data.access_token;

            const verifyRes = await axios.post(
                `https://api.${this.environment === 'live' ? '' : 'sandbox.'}paypal.com/v1/notifications/verify-webhook-signature`,
                {
                    auth_algo: req.headers['paypal-auth-algo'],
                    cert_url: req.headers['paypal-cert-url'],
                    transmission_id: req.headers['paypal-transmission-id'],
                    transmission_sig: req.headers['paypal-transmission-sig'],
                    transmission_time: req.headers['paypal-transmission-time'],
                    webhook_id: this.configService.get<string>('PAYPAL_WEBHOOK_ID'), //  este lo tenés que configurar desde PayPal
                    webhook_event: req.body,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            return verifyRes.data.verification_status === 'SUCCESS';
        } catch (err) {
            console.error('❌ Error verificando webhook de PayPal:', err.message);
            return false;
        }
    }
}

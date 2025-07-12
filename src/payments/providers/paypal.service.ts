// src/payments/providers/paypal.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as paypal from '@paypal/checkout-server-sdk';
import { CreatePaymentDto } from '../dto/create-payment.dto';

@Injectable()
export class PaypalService {
    private client: paypal.core.PayPalHttpClient;

    constructor(private configService: ConfigService) {
        // Configurar el environment (sandbox o live)
        const environment = this.configService.get('PAYPAL_ENVIRONMENT') === 'live'
            ? new paypal.core.LiveEnvironment(
                this.configService.get<string>('PAYPAL_CLIENT_ID')!,
                this.configService.get<string>('PAYPAL_CLIENT_SECRET')!
            )
            : new paypal.core.SandboxEnvironment(
                this.configService.get<string>('PAYPAL_CLIENT_ID')!,
                this.configService.get<string>('PAYPAL_CLIENT_SECRET')!
            );

        this.client = new paypal.core.PayPalHttpClient(environment);
    }

    // Método para crear una orden de PayPal
    async createOrder(createPaymentDto: CreatePaymentDto) {
        const { amount, currency } = createPaymentDto;
        const request = new paypal.orders.OrdersCreateRequest();

        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: currency, // PayPal espera mayúsculas (ej. 'USD'), lo cual coincide con nuestro enum
                    value: amount.toString(), // PayPal espera el monto como string
                }
            }],
            application_context: {
                return_url: 'http://localhost:3000/success',
                cancel_url: 'http://localhost:3000/cancel'
            }
        });

        try {
            const response = await this.client.execute(request);
            return {
                id: response.result.id,
                status: response.result.status,
                links: response.result.links
            };
        } catch (error) {
            throw new Error(`Error creating PayPal order: ${error.message}`);
        }
    }

    // Método para capturar un pago de PayPal
    async captureOrder(orderId: string) {
        const request = new paypal.orders.OrdersCaptureRequest(orderId);

        try {
            const response = await this.client.execute(request);
            return {
                id: response.result.id,
                status: response.result.status,
                payer: response.result.payer,
                purchase_units: response.result.purchase_units
            };
        } catch (error) {
            throw new Error(`Error capturing PayPal order: ${error.message}`);
        }
    }

    // Método para obtener detalles de una orden
    async getOrderDetails(orderId: string) {
        const request = new paypal.orders.OrdersGetRequest(orderId);

        try {
            const response = await this.client.execute(request);
            return response.result;
        } catch (error) {
            throw new Error(`Error getting order details: ${error.message}`);
        }
    }
}
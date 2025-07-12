// src/payments/enums/payment-provider.enum.ts
export enum PaymentProvider {
    STRIPE = 'stripe',
    PAYPAL = 'paypal',
}

export enum PaymentStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded',
}

export enum PaymentCurrency {
    USD = 'USD',
    EUR = 'EUR',
    GBP = 'GBP',
    ARS = 'ARS', // Peso argentino
}
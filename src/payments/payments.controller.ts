import { Controller, Post, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';

// Importá los DTOs y enums
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentProvider } from './enums/payment-provider.enum';
import { PaymentStatus } from './enums/payment-provider.enum';
import { Payment } from './entities/payment.entity';
import { PaypalService } from './providers/paypal.service';
import { StripeService } from './providers/stripe.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';




@ApiTags('payments')
@UseGuards(AuthGuard) // Grupo en Swagger
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly paypalService: PaypalService,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Crear un pago con Stripe o PayPal' })
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({
    status: 201,
    description: 'Pago creado exitosamente',
    schema: {
      example: {
        paymentId: '1',
        provider: 'STRIPE',
        data: {}, // Aquí podría ser un objeto más detallado según provider
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Proveedor no soportado' })
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    const { provider } = createPaymentDto;

    let paymentResponse: Stripe.PaymentIntent | PaypalOrderResponse;

    switch (provider) {
      case PaymentProvider.STRIPE:
        paymentResponse = await this.stripeService.createPaymentIntent(createPaymentDto);
        break;
      case PaymentProvider.PAYPAL:
        paymentResponse = await this.paypalService.createOrder(createPaymentDto);
        break;
      default:
        throw new HttpException('Provider not supported', HttpStatus.BAD_REQUEST);
    }

    const payment = this.paymentRepository.create({
      amount: createPaymentDto.amount,
      currency: createPaymentDto.currency,
      provider: createPaymentDto.provider,
      providerPaymentId: paymentResponse.id,
      status: PaymentStatus.PENDING,
    });

    await this.paymentRepository.save(payment);

    return {
      paymentId: payment.id,
      provider: payment.provider,
      data: paymentResponse,
    };
  }
}


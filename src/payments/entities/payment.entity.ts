import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {
    PaymentCurrency,
    PaymentProvider,
    PaymentStatus,
} from '../enums/payment-provider.enum';

@Entity({ name: 'payments' })
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int' })
    amount: number;

    @Column({ type: 'enum', enum: PaymentCurrency })
    currency: PaymentCurrency;

    @Column({ type: 'enum', enum: PaymentProvider })
    provider: PaymentProvider;

    @Column()
    providerPaymentId: string;

    @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
    status: PaymentStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

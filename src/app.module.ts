import { Module } from '@nestjs/common';
import { PaymentsModule } from './payments/payments.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PaymentsModule,
    UsersModule,
    DatabaseModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

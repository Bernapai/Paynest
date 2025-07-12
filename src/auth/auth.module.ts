import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        PassportModule,
        UsersModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule { }

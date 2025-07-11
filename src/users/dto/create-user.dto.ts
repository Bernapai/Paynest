import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserCreateDto {
    @ApiProperty({
        example: 'Juan Pérez',
        description: 'Nombre completo del usuario',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        example: 'miContraseñaSegura123',
        description: 'Contraseña del usuario',
    })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({
        example: 'juan@example.com',
        description: 'Correo electrónico del usuario',
    })
    @IsNotEmpty()
    @IsString()
    email: string;
}

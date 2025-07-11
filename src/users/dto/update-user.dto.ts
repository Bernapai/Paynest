import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserUpdateDto {
  @ApiPropertyOptional({
    example: 'Juan Pérez',
    description: 'Nuevo nombre del usuario (opcional)',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'nuevaContraseñaSegura123',
    description: 'Nueva contraseña del usuario (opcional)',
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({
    example: 'juan.nuevo@example.com',
    description: 'Nuevo correo electrónico del usuario (opcional)',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    example: 'admin',
    description: 'Nuevo rol del usuario (opcional)',
  })
  @IsOptional()
  @IsString()
  role?: string;
}

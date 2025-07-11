import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import User from '../entities/user.entity';
import { UserUpdateDto } from '../dto/update-user.dto';
import { UserCreateDto } from '../dto/create-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Users') // Agrupa todos los endpoints bajo "Users"
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida correctamente',
    type: [User],
  })
  async getAll(): Promise<User[]> {
    return await this.usersService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario obtenido correctamente',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getOne(@Param('id') id: number): Promise<User | null> {
    return await this.usersService.getOne(id);
  }

  @Put(':id')

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un usuario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado correctamente',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async update(
    @Param('id') id: number,
    @Body() data: UserUpdateDto,
  ): Promise<User | null> {
    return await this.usersService.update(id, data);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado correctamente',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async register(@Body() data: UserCreateDto): Promise<User> {
    return await this.usersService.register(data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un usuario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado correctamente',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async delete(@Param('id') id: number): Promise<boolean> {
    return await this.usersService.delete(id);
  }
}
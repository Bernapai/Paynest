import { Controller, Post } from '@nestjs/common';
import { loginDto } from '../dto/loginUser.dto';
import { RegisterDto } from '../dto/registerUser.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(loginDto: loginDto) {
        return await this.authService.login(loginDto);
    }

    @Post('register')
    async register(registerDto: RegisterDto) {
        return await this.authService.register(registerDto);
    }
}

import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    email: string;
}

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    private getResend;
    register(dto: RegisterDto): Promise<{
        access_token: string;
        user: {
            [x: string]: unknown;
        };
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            [x: string]: unknown;
        };
    }>;
    forgotPassword(_dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    private signUser;
}

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Resend } from 'resend';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { JwtPayload } from './strategies/jwt.strategy';

const FORGOT_PASSWORD_RESPONSE = {
  message: 'If this email exists, a reset link has been sent',
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private getResend(): Resend | null {
    const key = this.configService.get<string>('resend.apiKey');
    if (!key) {
      return null;
    }
    return new Resend(key);
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const hashed = await bcrypt.hash(dto.password, 10);
    const referralCode = uuidv4();
    const user = await this.usersService.create({
      email: dto.email.toLowerCase(),
      password: hashed,
      firstName: dto.firstName,
      lastName: dto.lastName,
      referralCode,
    });

    const resend = this.getResend();
    if (resend) {
      await resend.emails.send({
        from: 'Pet Profile <onboarding@resend.dev>',
        to: user.email,
        subject: 'Welcome to Pet Profile 🐾',
        html: `<p>Hi ${user.firstName},</p><p>Thanks for joining Pet Profile. We are glad you are here.</p>`,
      });
    }

    const token = await this.signUser(user.id, user.email);
    const full = await this.usersService.findById(user.id);
    const safe = full
      ? await this.usersService.sanitize(full)
      : await this.usersService.sanitize(user);
    return { access_token: token, user: safe };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.signUser(user.id, user.email);
    const safeUser = await this.usersService.findById(user.id);
    const safe = safeUser
      ? await this.usersService.sanitize(safeUser)
      : await this.usersService.sanitize(user);
    return { access_token: token, user: safe };
  }

  async forgotPassword(_dto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(_dto.email);
    if (user) {
      const resend = this.getResend();
      if (resend) {
        const resetUrl = 'https://petprofile.app/reset?token=placeholder';
        await resend.emails.send({
          from: 'Pet Profile <onboarding@resend.dev>',
          to: user.email,
          subject: 'Reset your Pet Profile password',
          html: `<p>Click the link below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
        });
      }
    }
    return FORGOT_PASSWORD_RESPONSE;
  }

  private async signUser(userId: string, email: string) {
    const payload: JwtPayload = { sub: userId, email };
    return this.jwtService.signAsync(payload);
  }
}
